import React, { useState, useEffect, useContext } from 'react';
import classes from './Board.module.css';
import { IMAGES } from 'assets/images.js';
import SingleCard from './SingleCard';
import { LocationContext } from 'App.js';
import { PAGES } from 'utils/constants.js';

export const Board = (props) => {
  const { location, setLocation } = useContext(LocationContext);
  const [cards, setCards] = useState([]);
  const [move, setMove] = useState(0);
  const [moveToFinish, setMoveToFinish] = useState(0);

  const [pickOne, setPickOne] = useState(null);
  const [pickTwo, setPickTwo] = useState(null);

  const mixImages = () => {
    const images = [...IMAGES, ...IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((img, index) => ({ ...img, id: index, status: false }));

    setCards(images);
  };

  const chooseCard = (card) => {
    !pickOne ? setPickOne(card) : setPickTwo(card);
  };

  const reset = () => {
    setPickOne(null);
    setPickTwo(null);
    setMove((move) => move + 1);
  };

  useEffect(() => {
    const bothCardsOpened = pickOne && pickTwo;

    if (!bothCardsOpened) {
      return;
    }
    if (pickOne.src === pickTwo.src) {
      setCards((cards) => {
        return cards.map((item) => {
          if (item.src === pickOne.src) {
            return { ...item, status: true };
          } else {
            return item;
          }
        });
      });
      reset();
      setMoveToFinish((move) => move + 1);
    } else {
      setTimeout(() => reset(), 500);
    }
  }, [pickOne, pickTwo]);

  useEffect(() => {
    if (moveToFinish === 8) {
      console.log('Finish');
      setLocation(PAGES.Results);
    }
  }, [moveToFinish, setLocation]);

  useEffect(() => {
    if (location === PAGES.Game) {
      mixImages();
    }
  }, [location]);

  return (
    <div>
      <div className={classes.moveCounter}>Ход: {move}</div>
      <div className={classes.move}>Счёт: {moveToFinish} / 8</div>
      <div className={classes.boardGrid}>
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            chooseCard={chooseCard}
            isOpen={card === pickOne || card === pickTwo || card.status}
          />
        ))}
      </div>
    </div>
  );
};
