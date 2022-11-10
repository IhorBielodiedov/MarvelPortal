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
        error: false
    }

    componentDidMount() {
        this.updateChar();
    }

    updateChar = () => {
        this.setState({loading: true})
        this.marvelService.getAllCharacters().then(this.onCharLoaded).catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false})
    }

    onError = () => {
        this.setState({error: true, loading: false})
    }

    render () {
        console.log(this.state.char);
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
const View = ({char}) => {
    const elements = char.map(element => {
        return (
        <li key={char.indexOf(element)} className="char__item char__item_selected">
            <img src={element.thumbnail} alt="abyss"/>
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

export default CharList;