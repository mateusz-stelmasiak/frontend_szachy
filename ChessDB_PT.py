from datetime import date

import mysql.connector


class ChessDB:

    def __init__(self):
        self.mydb = mysql.connector.connect(host="localhost", user="admin", password="12345", database="ChessDB")

    def create_db(self):
        mycursor = self.mydb.cursor()

        mycursor.execute('''create table if not exists Participants
                            (ParticipantID integer primary key AUTO_INCREMENT, 
                            GameID INTEGER  not null,
                            UserID Integer not null,
                            Foreign key (GameID) references  Games(GameID) on delete cascade,
                            Foreign key (UserID) references  Users(UserID) on delete cascade, 
                            Score decimal not null, 
                            Color varchar(32) not null);''')

        mycursor.execute('''create table if not exists Moves
                            (MoveID integer primary key AUTO_INCREMENT,
                            GameID INTEGER  not null,
                            ParticipantID INTEGER  not null,
                            Foreign key (GameID) references  Games(GameID) on delete cascade,
                            Foreign key (ParticipantID) references Participants(ParticipantID) on delete cascade, 
                            move_order integer not null, 
                            Move varchar(100) not null);''')

        mycursor.execute('''create table if not exists Games
                            (GameID integer primary key AUTO_INCREMENT, 
                            win_type varchar(100), 
                            played DATE);''')

        mycursor.execute('''create table if not exists Users
                            (userID integer primary key AUTO_INCREMENT,
                            Username varchar(64) unique not null, 
                            Password varchar(64) not null, 
                            Country varchar(64), 
                            Joined DATE not null,
                            currELO int not null);''')
        mycursor.close()

    def add_user(self, Username, Password, Country, J_Day, J_Month, J_Year, currElo):
        mycursor = self.mydb.cursor()

        sql_user = ("INSERT INTO Users "
                    "(Username, Password, Country, Joined, currELO) "
                    "VALUES (%s, %s, %s, %s, %s)")

        data_user = (Username, Password, Country, date(J_Year, J_Month, J_Day, currElo))
        mycursor.execute(sql_user, data_user)
        self.mydb.commit()
        mycursor.close()

    def add_game(self, w_user, w_score, b_user, b_score, win_type, played_day, played_month, played_year, moves):
        # gdzie moves to lista list gdzie move = (Color, move_order, move)

        mycursor = self.mydb.cursor()

        sql_game = ("INSERT INTO Games "
                    "(win_type, played) "
                    "VALUES (%s, %s)")

        data_game = (win_type, date(played_year, played_month, played_day))
        mycursor.execute(sql_game, data_game)
        game_id = mycursor.lastrowid()

        sql_participant = ("INSERT INTO Participants"
                           "(GameID, UserID, Score, Color)"
                           "VALUES(%s, $s, $s, $s)")

        data_participant = (game_id, self.get_user(w_user)[0], w_score, "White")
        mycursor.execute(sql_participant, data_participant)
        data_participant = (game_id, self.get_user(b_user)[0], b_score, "Black")
        mycursor.execute(sql_participant, data_participant)

        sql_move = ("INSERT INTO Moves"
                    "(GameID, ParticipantID, move_order, Move)"
                    "VALUES (%s, %s, %s, %s)")
        for move in moves:
            data_move = (game_id, self.get_participant(move[0], game_id), move[1], move[2])
            mycursor.execute(sql_move, data_move)
        self.mydb.commit()
        mycursor.close()

    def update_elo(self, new_elo, Username):
        mycursor = self.mydb.cursor()

        sql_update = ("""UPDATE Users SET currELO = %s WHERE UserID = %s""")

        data_update = (new_elo, self.get_user(Username)[0])
        mycursor.execute(sql_update, data_update)
        self.mydb.commit()
        mycursor.close()

    def update_password(self, new_password, Username):
        mycursor = self.mydb.cursor()

        sql_update = ("""UPDATE Users SET Password = %s WHERE UserID = %s""")

        data_update = (new_password, self.get_user(Username)[0])
        mycursor.execute(sql_update, data_update)
        self.mydb.commit()
        mycursor.close()

    def get_user(self, Username):
        mycursor = self.mydb.cursor()

        sql_find = ("SELECT * FROM Users WHERE Users.Username = %s")

        data_find = (Username,)
        mycursor.execute(sql_find, data_find)
        result = mycursor.fetchone()
        mycursor.close()
        return result

    def get_participant(self, Color, GameID):
        mycursor = self.mydb.cursor()

        sql_find = ("SELECT * FROM Participants WHERE Color = %s AND GameID = %s;")

        data_find = (Color, GameID)
        mycursor.execute(sql_find, data_find)
        result = mycursor.fetchone()
        mycursor.close()
        return result

    def get_moves(self, GameID):
        mycursor = self.mydb.cursor()

        sql_find = ("SELECT * FROM Moves WHERE GameID = %s;")

        data_find = GameID
        mycursor.execute(sql_find, data_find)
        result = mycursor.fetchall()
        mycursor.close()
        return result

    def get_games(self, Username1, Username2):
        mycursor = self.mydb.cursor()

        sql_find = ("""SELECT t1.* FROM (SELECT Games.*,participants.UserID FROM Games,participants
                       WHERE Participants.UserID = %s AND Games.GameID = participants.GameID)t1
                       INNER JOIN (SELECT Games.*,participants.UserID FROM Games,Participants
                       WHERE Participants.UserID = %s  AND Games.GameID = participants.GameID)t2
                       ON (t1.GameID = t2.GameID);""")

        data_find = (self.get_user(Username1)[0], self.get_user(Username2)[0])
        mycursor.execute(sql_find, data_find)
        result = mycursor.fetchall()
        mycursor.close()
        return result

    def count_games(self, Username):
        mycursor = self.mydb.cursor()

        sql_count = (
            "SELECT COUNT(Games.GameID) FROM Games, Participants WHERE UserID = %s AND Games.GameID = Participants.GameID")

        data_count = (self.get_user(Username)[0],)
        mycursor.execute(sql_count, data_count)
        result = mycursor.fetchone()
        mycursor.close()
        return result

    def count_wins(self, Username):
        mycursor = self.mydb.cursor()

        sql_count = ("""SELECT COUNT(t1.GameID) FROM (SELECT Games.GameID, Score FROM Games, Participants 
                        WHERE UserID = %s AND Games.GameID = Participants.GameID)t1 
                        WHERE Score = 1;""")

        data_count = (self.get_user(Username)[0],)
        mycursor.execute(sql_count, data_count)
        result = mycursor.fetchone()
        mycursor.close()
        return result

    def count_draws(self, Username):
        mycursor = self.mydb.cursor()

        sql_count = ("""SELECT COUNT(t1.GameID) FROM (SELECT Games.GameID,Score FROM Games, Participants
                     WHERE UserID = %s AND Games.GameID = Participants.GameID)t1
                     WHERE Score = 0.5""")

        data_count = (self.get_user(Username)[0],)
        mycursor.execute(sql_count, data_count)
        result = mycursor.fetchone()
        mycursor.close()
        return result

    def count_losses(self, Username):
        mycursor = self.mydb.cursor()

        sql_count = ("""SELECT COUNT(t1.GameID) FROM (SELECT Games.GameID, Score FROM Games, Participants 
                         WHERE UserID = %s AND Games.GameID = Participants.GameID)t1
                         WHERE Score = 0""")

        data_count = (self.get_user(Username)[0],)
        mycursor.execute(sql_count, data_count)
        result = mycursor.fetchone()
        mycursor.close()
        return result


tempDB = ChessDB()
tempDB.create_db()
print(tempDB.count_losses("PainTrain"))
