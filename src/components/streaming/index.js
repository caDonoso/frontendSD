import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../loading/';
import './style.scss';

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';

class streaming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      count: 0,
      isStreamingOn: false,
      tweets: [],
      words: [],
      dropdownOpen: false,
      wordSelected: '',
      inputWordValue: '',
    };
    this.startStreaming = this.startStreaming.bind(this);
    this.stopStreaming = this.stopStreaming.bind(this);
    this.onChangeWordSelected = this.onChangeWordSelected.bind(this);
  }

 

  startStreaming(){
    
    this.setState({
      isStreamingOn: true
    });
    this.myInterval = setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count + 1
      }));
    }, 1000)
    this.getTweets();
  }

  stopStreaming(){
    this.setState({
      isStreamingOn: false,
      count: 0,
    });
    clearInterval(this.myInterval)
  }

  componentDidMount(){
    this.getWords();
  }

  componentWillMount(){
    clearInterval(this.myInterval)
  }

  refreshPageIn(seconds){
    if(this.state.count === seconds){
      this.getTweets();
      clearInterval(this.myInterval)
      this.setState({
        count: 0
      });
      this.myInterval = setInterval(() => {
        this.setState(prevState => ({
          count: prevState.count + 1
        }));
      }, 1000)
    }
  }
  

  getTweets() {
    if(this.state.wordSelected === ''){ //Se buscan todos los tweets
      axios.get('http://40.121.62.100:9000/tweets/20')
        .then(result => {
          this.setState({
            isLoading: false,
            tweets: result.data,
            count: 0,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            isLoading: false,
            tweets: []
          });
          alert("No ha sido posible conectarse al servidor para obtener los Tweets.");
        })
    }
    else{ //Se buscan los tweets en base a una palabra en especifico
      let palabra = this.state.wordSelected;
      if(palabra[0] === '#'){
        palabra = palabra.split("#")[1];
      }
      axios.get('http://40.121.62.100:9000/tweets/by-word/'+ palabra + "/20")
        .then(result => {
          this.setState({
            isLoading: false,
            tweets: result.data,
            count: 0,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            isLoading: false,
            tweets: []
          });
          alert("No ha sido posible conectarse al servidor para obtener los Tweets.");
        })
    }
  }

  getWords() {
    console.log("URL: " + process.env.REACT_APP_API_URL+"/words/");
    axios.get('http://40.121.62.100:9000/words/')
      .then(response => {
        this.setState({
          isLoading: false,
          words: response.data
        });
      })
      .catch(error => {
        console.log("hola mundo: ", error);
        this.setState({
          isLoading: false,
          words: [],
        });
        alert("No ha sido posible conectarse al servidor para obtener la Bolsa de Palabras.");
      })
  }

  toggleDropDown(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onChangeWordSelected(event){
    event.preventDefault();
    const value = event.target.value;
    let d = document.getElementById("dropdownWords");
    let displayText = d.options[d.selectedIndex].text;
    
    if(event.target.value === "1"){
      this.setState({
        dropdownOpen: !this.state.dropdownOpen,
        wordSelected: '',
        inputWordValue: value
      });
    }
    else{
      this.setState({
        dropdownOpen: !this.state.dropdownOpen,
        wordSelected: displayText,
        inputWordValue: value
      });
    }
  }

  render() {
    this.refreshPageIn(10);

    
    return (
      <div id="streamingId"> 
        <div className="card">
          <div className="card-header">
            <div>
              <div className="row"> 
                <h3 id="labelStreaming">Streaming de tweets</h3>
              </div>
              <div className="row"> 
                <FormGroup>
                  <Label for="dropdownWords"> ¿Quieres buscar por una palabra especifica?, escoge la que quieras! (Puedes editar la bolsa de palabras desde el menu de bolsa de palabras) </Label>
                  <Input
                    id="dropdownWords"
                    value={this.state.inputWordValue}
                    type="select"
                    onChange={this.onChangeWordSelected}
                  >
                   
                    {this.state.words.map( (word,key) => {
                      return(<option key={key + 1} value={key + 2}> {word.value} </option>)
                    })
                    }
                  </Input>
                </FormGroup>
              </div>
              <div className="row"> 
                <div id="btnStreaming">
                  {!this.state.isStreamingOn && 
                    <button type="button" class="btn btn-success" onClick={this.startStreaming}> Empezar streaming </button>
                  }

                  {this.state.isStreamingOn &&
                    <button type="button" class="btn btn-warning" onClick={this.stopStreaming}> Detener streaming </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            { this.state.isLoading ? 
              <Loading />
              :
              <ul>
              { this.state.tweets.map((tweet, index) => {
                  return (
                    <li key={index}>
                      <div id="tweet" class="card text-white bg-info mb-3">
                        <div class="card-header">
                          <span>{tweet.user}</span>
                        </div>
                          <div class="card-body">
                            <p class="card-text">{tweet.text}</p>
                          </div>
                      </div>
                    </li>
                  )
                })
              }
              </ul>
          }
          </div>
        </div>
      </div>
    );
  }
}

export default streaming;