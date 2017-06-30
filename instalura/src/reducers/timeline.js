import {List} from 'immutable';

function trocafoto(lista, fotoId, callbackAtualizaPropriedades)
{
    const fotoEstadoAntigo  = lista.find((foto) => foto.id === fotoId  )
    const novasPropriedades = callbackAtualizaPropriedades(fotoEstadoAntigo);
    const fotoEstadoNovo = Object.assign({},fotoEstadoAntigo, novasPropriedades);
    const indiceNovaLista  = lista.findIndex((foto) => foto.id === fotoId);
    return lista.set(indiceNovaLista, fotoEstadoNovo);
}

//REDUCER
export function timeLine(state=new List(), action) {
    if(action.type === 'LISTAGEM')
    {
        return new List(action.fotos);
    }

    if(action.type === 'COMENTARIO')
    {
        return trocafoto(state,action.fotoId, fotoAntigo => {
            const novosComentarios = fotoAntigo.comentarios.concat(action.novoComentario);
            return {comentarios: novosComentarios};
        });
    }

    if(action.type === 'LIKE')
    {
       return trocafoto(state, action.fotoId, fotoAntigo => {

           const liker = action.liker;


           const likeada = !fotoAntigo.likeada;


           const possivelLike = fotoAntigo.likers.find(likerAtual => {

               return likerAtual.login === liker.login
           })

           let novosLikers;
           if(possivelLike === undefined)
           {
               novosLikers =  fotoAntigo.likers.concat(liker);
           }
           else
           {
               novosLikers = fotoAntigo.likers.filter(likerAtual => {
                   likerAtual.login !== liker.login;
               })

           }
           return {likeada, likers:novosLikers};
       });
    }
    return state ;
}