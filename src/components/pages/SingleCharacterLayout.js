import "./singleCharacterLayout.scss";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import MarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

const SingleCharacterLayout = () => {
  const { charId } = useParams();
  const [char, setChar] = useState(null);

  const { getCharacter, clearError, process, setProcess } = MarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  return <>{setContent(process, View, char)}</>;
};

const View = ({ data }) => {
  const { name, description, thumbnail } = data;

  return (
    <div className="single-comic">
      <img src={thumbnail} alt={name} className="single-comic__char-img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
    </div>
  );
};

export default SingleCharacterLayout;
