import {board, cols, pixel_positions, rows, size} from "./Main";
import Piece from "./Piece";
import {moves} from "./moves";




export default class Board {


    constructor(p5) {
        this.p5 = p5;
        this.grid = [];
        for (let i = 0; i < 64; i++) {
            this.grid.push(new Piece("e",this.p5));
        }
            this.FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.load_FEN()
        this.color_to_move = "";
        this.lastPawnMoveOrCapture = 0;
        this.lastmove = [-1,-1];
    }


    get_pos(i, j) {
        let x = i * size;
        let y = j * size;
        return [x, y]
    }

    set_FEN(FEN) {
        this.FEN = FEN;
    }

    set_FEN_from_grid() {
        let empty_spaces = 0;
        let temp_fen = "";
        for (let i = 0; i < board.grid.length; i++) {
            if (i % 8 === 0 && i !== 0) {
                if (empty_spaces !== 0) {
                    temp_fen += empty_spaces.toString();
                    empty_spaces = 0;
                }
                temp_fen += '/';
            }
            if (board.grid[i].type_letter !== 'e') {
                if (empty_spaces !== 0) {
                    temp_fen += empty_spaces.toString();
                    empty_spaces = 0;
                }
                temp_fen += board.grid[i].type_letter;
            } else {
                empty_spaces++;
            }

        }
        if (empty_spaces !== 0) {
            temp_fen += empty_spaces.toString();
            empty_spaces = 0;
        }

        //TODO
        //sprawdzic czy król sie juz ruszył i wieza czy sie da roszade zrobic i wtedy dopisać ją do fena, tak samo który jest teraz ruch
        temp_fen += " " + this.color_to_move + " " + this.FEN.split(' ')[2] + " " + this.FEN.split(' ')[3] + " " + this.FEN.split(' ')[4] + " " + this.FEN.split(' ')[5];
        console.log(temp_fen);
        this.FEN = temp_fen;
    }

    set_FEN_by_move(StartingSquare, TargetSquare) {




        let temp = board.grid[StartingSquare];
        board.grid[StartingSquare] = board.grid[TargetSquare];
        board.grid[TargetSquare] = temp;
        board.grid[TargetSquare].old_x = pixel_positions[TargetSquare][0];
        board.grid[TargetSquare].old_y = pixel_positions[TargetSquare][1];


        //print_board2();
        this.set_FEN_from_grid()
    }

    load_FEN() {
        let split_FEN = this.FEN.split(' ')

        this.color_to_move = split_FEN[1];   //setting color to move from fen

        let fenBoard = split_FEN[0];   // taking only pieces position (FEN.split[0]), discarding game info
        let file = 0;
        let rank = 0;
        for (var i = 0; i < fenBoard.length; i++) {
            let e = fenBoard[i];
            if (e === '/') {
                rank = 0;
                file++;
            } else {
                if (Number.isInteger(Number(e))) {
                    rank += Number(e);
                } else {
                    let temp = this.get_pos(rank, file);
                    this.grid[file * 8 + rank].type = e;
                    this.grid[file * 8 + rank].type_letter = e;
                    e === e.toUpperCase() ? this.grid[file * 8 + rank].color = 'w' : this.grid[file * 8 + rank].color = 'b';
                    this.grid[file * 8 + rank].x = temp[0];
                    this.grid[file * 8 + rank].y = temp[1];
                    this.grid[file * 8 + rank].old_x = temp[0];
                    this.grid[file * 8 + rank].old_y = temp[1];
                    rank++;
                }
            }
        }

    }


    draw_board() {
        let i = 0;
        let dragged_index = -1;
        let j = 0;


        for (let i = 0; i < moves.length; i++) {

            let highlight = pixel_positions[moves[i].EndSquare];
            if (board.grid[moves[i].StartSquare].dragging) {
                this.p5.rect(highlight[0], highlight[1], 100, 100);
            }
        }


        for (let k = 0; k < this.grid.length; k++) {
            let piece = this.grid[k];
            if (piece.type_letter !== 'e') {
                if (piece.drag()) {
                    piece.movePiece();
                    dragged_index = k;
                } else {
                    piece.draw_piece();
                }
                i++;
                if (i % 8 === 0) {
                    i = 0;
                    j++;
                }
            } else {
                i++;
                if (i % 8 === 0) {
                    i = 0;
                    j++;
                }
            }
        }
        if (dragged_index !== -1) {
            this.grid[dragged_index].draw_piece();
        }

    }
    change_Turn(){
        this.color_to_move ==='b' ? this.color_to_move = 'w' : this.color_to_move = 'b';
    }

}

