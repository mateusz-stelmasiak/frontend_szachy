import './App.css';
import LogRegScreen from "./containers/LogRegScreen/LogRegScreen";
import MainPageScreen from "./containers/MainPageScreen/MainPageScreen";
import PlayGameScreen from "./containers/PlayGameScreen/PlayGameScreen";
import NavBar from "./containers/Navigation/NavBar";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

//redirects to login if user is not authenticated
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)



function App() {
  return (
          <div className="App">
                  <Router>
                      <Route path="/" component={NavBar}/>
                      <Switch>
                          <PrivateRoute exact path="/" component={MainPageScreen} />
                          <PrivateRoute path="/play" component={PlayGameScreen} />
                          <Route path="/login" component={LogRegScreen} />
                          <Redirect from="*" to="/" />
                      </Switch>
                  </Router>
          </div>
  );
}

export default App;
