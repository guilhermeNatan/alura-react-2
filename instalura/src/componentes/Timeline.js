import React, { Component } from 'react';
import FotoItem from './FotoItem';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
export default class Timeline extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            fotos:[]
        };


        this.login = props.login;
    }

    componentWillMount()
    {
     Pubsub.subscribe('timeline', (topico,fotosPesquisadas) =>{
         this.setState({fotos:fotosPesquisadas})
     })

    }
    carregaFotos()
    {
        let urlPefil;

        if(this.login === undefined)
        {
            urlPefil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        }
        else {
            urlPefil = `http://localhost:8080/api/public/fotos/${this.login}`;
        }
        /*response.json() cria um objeto a partir do json que é enviado na resposta*/
        fetch(urlPefil)
            .then(response=> response.json())
            .then(fotos => {this.setState({fotos:fotos})});
    }

    componentDidMount()
    {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps)
    {

        if(nextProps.login !== undefined)
        {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }
    render(){
        return (


            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
                    }
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}