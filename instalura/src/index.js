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

function verificaAutenticacao(nextState, replace) {
    const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname)
    const ehEnderecoPrivado = resultado.paramValues[0] === undefined;


    if(ehEnderecoPrivado && localStorage.getItem('auth-token') === null)
    {
        replace('/?msg=Você precisa estar locado para acessar a aplicação');
    }

}
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao}/>
        <Route path="/logout" component={Logout} />

    </Router>,
    document.getElementById('root'));
registerServiceWorker();
