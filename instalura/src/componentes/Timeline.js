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


    Pubsub.subscribe('atualiza-liker', (topico, infoLiker)=>{

        const fotoAchada  = this.state.fotos.find((foto) => foto.id === infoLiker.fotoId )
        fotoAchada.likeada = !fotoAchada.likeada


            const possivelLike = fotoAchada.likers.find(liker => {

                return liker.login === infoLiker.liker.login
            })

            if(possivelLike === undefined)
            {
                fotoAchada.likers.push(infoLiker.liker);

            }
            else
            {
                const novosLikers = fotoAchada.likers.filter(liker => {
                    liker.login !== infoLiker.liker.login;
                })
                fotoAchada.likers = novosLikers;

            }
        this.setState({fotos: this.state.fotos});

    })

    Pubsub.subscribe("novos-comentarios", (topico,infoNovoComentario)=>{
        console.log(infoNovoComentario);
        const fotoAchada  = this.state.fotos.find((foto) => foto.id === infoNovoComentario.fotoId )
            const novosComentarios = fotoAchada.comentarios.push(infoNovoComentario.novoComentario);
             this.setState({fotos: this.state.fotos});
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
    like(fotoId)
    {

        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method:'POST'})
            .then(response => {
                if(response.ok)
                {
                    return response.json();
                }else
                {
                    throw new Error("Não foi possível dar like na foto");
                }
            })
            .then(liker =>{
                Pubsub.publish('atualiza-liker',{fotoId, liker});
            });
    }

    comenta(fotoId, textoComentario)
    {
        const requestInfo = {
            method: 'POST',
            body:JSON.stringify({texto:textoComentario}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        }
        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,requestInfo)
            .then(response=>{
                if(response.ok)
                {
                    return response.json();
                }else
                {
                    throw new Error("Não foi possível comentar a foto")
                }
            }).then(novoComentario =>{
            Pubsub.publish("novos-comentarios", {fotoId, novoComentario})

        })
    }
    render(){
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}