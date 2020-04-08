import React, { Component } from 'react';
import Card from "./Card";
import './Game.css';
import axios from "axios";
const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Game extends Component {
    constructor(props){
        super(props);
        this.state = { deck: null, drawn: [] };
        this.getCard = this.getCard.bind(this);
    }
    async componentDidMount(){
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        this.setState({ deck: deck.data });
    }
    async getCard(){
        let deck_id = this.state.deck.deck_id;
        try {
            let cardUrl = `${API_BASE_URL}/${deck_id}/draw`;
            let cardRes = await axios.get(cardUrl);
            if (!cardRes.data.success){
                throw new Error("No cards remaining!")
            }
            console.log(cardRes.data);
            let card = cardRes.data.cards[0];
            this.setState(st => ({
                drawn: [
                    ...st.drawn, 
                    {
                        id: card.code, 
                        image: card.image,
                        name: `${card.value} of ${card.suit}`
                    }
                ]
            }));
        } catch (err){
            alert(err)
        }    
    }
    render(){
        const cards = this.state.drawn.map(c => (
            <Card key={c.id} name={c.name} image={c.image} />
        ));
        return(
            <div className="Game">
                <h1 className="Game-title">Card Dealer</h1>
                <h2 className="Game-title subtitle">A little demo with React</h2>
                <button className="Game-btn" onClick={this.getCard}>Get Card!</button>
                <div className="Game-cardarea">{cards}</div>
            </div>
        )
    }
}

export default Game;