import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import {Router,Route,browserHistory} from 'react-router';
import Login from './componentes/Login.js';
import Logout from './componentes/Logout.js';
import {matchPattern} from 'react-router/lib/PatternUtils';
import {Provider} from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import {timeLine} from '../src/reducers/timeline';
import {notificacao} from '../src/reducers/header';
import thunkMiddleware from 'redux-thunk';

const reducers = combineReducers({timeLine, notificacao});
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

function verificaAutenticacao(nextState, replace) {
    const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname)
    const ehEnderecoPrivado = resultado.paramValues[0] === undefined;


    if(ehEnderecoPrivado && localStorage.getItem('auth-token') === null)
    {
        replace('/?msg=Você precisa estar logado para acessar a aplicação');
    }

}


ReactDOM.render(
    <Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao}/>
        <Route path="/logout" component={Logout} />
    </Router>
    </Provider>
    ,
    document.getElementById('root'));
registerServiceWorker();
