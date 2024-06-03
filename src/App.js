import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';


export default function App() {
  const [color, setColor] = useState("red");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Client ID:', process.env.REACT_APP_NAVER_CLIENT_ID);
        console.log('Client Secret:', process.env.REACT_APP_NAVER_CLIENT_SECRET);
        setLoading(true);
        const response = await axios.get("/proxy/v1/search/image", {
          params: {
            query: color,
            display: 50,
            start: page
          },
          headers: {
            'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
          }
        });
        console.log(response.data);
        setData(prevData => [...prevData, ...response.data.items]);
      } catch (error) {
        console.error('Error Fetching Data', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [color, page]);


  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 50);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const handleButtonClick = (buttonColor) => {
    setColor(buttonColor);
    setPage(1);
    setData([]);
  };

  return (
    <>
      <ButtonContainer>
        <Button color="red" onClick={() => handleButtonClick("red")}>Red</Button>
        <Button color="blue" onClick={() => handleButtonClick("blue")}>Blue</Button>
        <Button color="orange" onClick={() => handleButtonClick("orange")}>Orange</Button>
        <Button color="yellow" onClick={() => handleButtonClick("yellow")}>Yellow</Button>
        <Button color="green" onClick={() => handleButtonClick("green")}>Green</Button>
      </ButtonContainer>
      <CardContainer>
        {data.map((item, index) => {
          console.log(item)
          if (data.length === index + 1) {
            return (
              <Card ref={lastElementRef} key={index}>
                <ImageContainer>
                  <Image src={item.link} />
                </ImageContainer>
              </Card>
            );
          } else {
            return (
              <Card key={index}>
                <ImageContainer>
                  <Image src={item.link} />
                </ImageContainer>
              </Card>
            );
          }
        })}
      </CardContainer>
      {loading && <Loading>Loading...</Loading>}
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid ${props => props.color};
  border-radius: 3px;
  background-color: ${props => props.color};
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  &:hover {
    background: white;
    color: ${props => props.color};
    transition: 0.5s;
  }
`;

const Loading = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
  padding: 10px;
`;

const Card = styled.div`
  color: red;
  font-size: 1em;
  margin: 1em;
  padding: 1em;
  border: 2px solid white;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 2px solid red;
    transition: 0.5s;
  }

  @media (max-width: 768px) {
    font-size: 0.8em;
    margin: 0.5em;
    padding: 0.5em;
  }

  @media (max-width: 480px) {
    font-size: 0.6em;
    margin: 0.3em;
    padding: 0.3em;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 8em;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 6em;
  }

  @media (max-width: 480px) {
    height: 4em;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;