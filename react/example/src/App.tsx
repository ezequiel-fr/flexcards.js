import React from 'react';

import { Carousel, Component, ImageComponent } from 'flexcardsjs-react';

import img1 from './images/landscape1.jpeg';
import img2 from './images/landscape2.jpg';
import img3 from './images/landscape3.jpg';

const App = () => {
    return (<>
        <Carousel id="flexcards" className="basic">
            <Component>
                <h1>First lorem :</h1>

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa perspiciatis
                ex error animi sunt labore, dicta, aut consectetur dolorum magnam excepturi
                quas nostrum vero, veritatis adipisci atque ipsa ullam fuga!
            </Component>

            <Component>
                <h1>Second lorem :</h1>

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa perspiciatis
                ex error animi sunt labore, dicta, aut consectetur dolorum magnam excepturi
                quas nostrum vero, veritatis adipisci atque ipsa ullam fuga!
            </Component>

            <Component>
                <h1>Third lorem :</h1>

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa perspiciatis
                ex error animi sunt labore, dicta, aut consectetur dolorum magnam excepturi
                quas nostrum vero, veritatis adipisci atque ipsa ullam fuga!
            </Component>

            <Component>
                <h1>Fourth lorem :</h1>

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa perspiciatis
                ex error animi sunt labore, dicta, aut consectetur dolorum magnam excepturi
                quas nostrum vero, veritatis adipisci atque ipsa ullam fuga!
            </Component>

            <Component>
                <h1>Fifth lorem :</h1>

                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa perspiciatis
                ex error animi sunt labore, dicta, aut consectetur dolorum magnam excepturi
                quas nostrum vero, veritatis adipisci atque ipsa ullam fuga!
            </Component>
        </Carousel>

        <Carousel
            id="flexcards"
            className="images"
            // Custom params
            arrowUrl="https://upload.wikimedia.org/wikipedia/commons/6/65/Circle-icons-car.svg"
            delay={3000}
            indexType="numbers"
            timer={false}
            theme="#0ff"
            colorized={false}
        >
            <ImageComponent src={img1} alt="Landscape" />
            <ImageComponent src={img2} alt="Landscape" />
            <ImageComponent src={img3} alt="Landscape" />
        </Carousel>
    </>);
};

export default App;
