import styled from 'styled-components';
import React, { forwardRef } from 'react';

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
`;

const Card = styled.div`
    color: red;
    font-size: 1em;
    margin: 1em;
    padding: 1em 1em;
    border: 2px solid white;
    border-radius: 3px;
    width: 10em;
    height: 10em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:hover {
        border: 2px solid red;
        color: white;
        transition: 0.5s;
    }
`;

const ImageContainer = styled.div`
    width: 10em;
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Cards = forwardRef(({ data }, ref) => {
  return (
    <CardContainer>
      {data.map((item, index) => (
        <Cards key={index} ref={index === data.length - 1 ? ref : null}>
          <ImageContainer>
            <Image src={item.image} alt={item.title} />
          </ImageContainer>
          {item.title}
        </Cards>
      ))}
    </CardContainer>
  );
});

export default Cards