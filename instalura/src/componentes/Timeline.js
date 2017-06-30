import React, { Component } from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TimeLineApi from '../logicas/TimeLineApi';
import {connect} from 'react-redux';

class Timeline extends Component {

    constructor(props)
    {
        super(props);
        this.login = props.login;

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

        this.props.lista(urlPefil);

    }

    componentDidMount()
    {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps)
    {

        if(nextProps.login !== this.login)
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
                        this.props.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.props.like} comenta={this.props.comenta}/>)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {fotos: state.timeLine};
}

const mapDispatchToProps = (dispatch) => {
    return {
        like: (fotoId) => {
            dispatch(TimeLineApi.like(fotoId))
        },
        comenta: (fotoId, textoComentario) => {
            dispatch(TimeLineApi.comenta(fotoId,textoComentario))
        },
        lista: (urlPefil) => {
            dispatch(TimeLineApi.listaFotos(urlPefil))
        },
    }
}


const TimeLineConteiner = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimeLineConteiner ;