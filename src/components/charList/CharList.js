import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

class CharList extends Component {

    marvelService = new MarvelService();

    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest   = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset).then(this.onCharLoaded).catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({newItemLoading: true})
    }
    updateChar = () => {
        this.setState({loading: true})
        this.marvelService.getAllCharacters().then(this.onCharLoaded).catch(this.onError);
    }

    onCharLoaded = (newChar) => {
        let ended = false;
        if(newChar.length < 9){
            ended = true;
        }
        this.setState(({char, offset})=>({char: [...char, ...newChar], loading: false, newItemLoading: false, offset: offset + 9, charEnded: ended}))
    }

    onError = () => {
        this.setState({error: true, loading: false})
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    
    focusOnItem = (id) => {
        this.itemRefs.forEach(elem => elem.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems (char) {
        const elements = char.map((element, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (element.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
            <li 
                className="char__item"
                tabIndex={0}
                ref={this.setRef}
                key={element.id}
                onClick={() => {
                    this.props.onCharSelected(element.id)
                    this.focusOnItem(i);
                }}
                onKeyPress={(e)=>{
                    if(e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(element.id);
                        this.focusOnItem(i);
                    }
                }}
                >
                <img src={element.thumbnail} alt="abyss" style={imgStyle}/>
                <div className="char__name">{element.name}</div>
            </li>
            )
        })
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    render () {
        console.log(this.state.char);
        const {char, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(char)
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={()=> this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;