import React, { Component } from 'react';
import axios from 'axios';
import './style.scss';
import Loading from '../loading/';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class wordsBag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenInput: false,
      isLoading: true,
      words: [],
    };

    console.log(process.env);
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount(){
    this.getWords();
  }

  getWords() {
    axios.get('http://40.121.62.100:9000/words/')
      .then(result => {
        this.setState({
          isLoading: false,
          words: result.data
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
          words: []
        });
        alert("No ha sido posible conectarse al servidor para obtener la Bolsa de Palabras.");
      })
  }

  add(){
    var newWord = "#" + this.newWordInput.value;
    axios.post('http://40.121.62.100:9000/words/', {value: newWord})
      .then(result =>{
        this.newWordInput.value = "";
        this.getWords();
      })
      .catch(error => {
        console.log(error);
        alert("Ha ocurrido un error al intentar agregar la palabra.")
      })
  }

  delete(word){
    if (window.confirm('Está seguro que desea eliminar la palabra de la bolsa?')) {
      axios.delete('http://40.121.62.100:9000/words/', {data: {value: word}})
        .then(result =>
          this.getWords()
        )
        .catch(error => {
          alert("Ha ocurrido un error al intentar eliminar la palabra.")
        })
    }
  }

  render() {
    return (
      <div id="wordsBagId"> 
        <div className="card">
          <div className="card-header">
            <div>Bolsa de palabras</div>
            <div className="input-group">
              <input ref={input => this.newWordInput = input} type="text" className="form-control" placeholder="Ingrese una palabra" />
              <button type="button" className="btn btn-primary" onClick={ () => this.add() }>Añadir</button>
            </div>
          </div>
          <div id="cardWordsBagBody" className="card-body scroll">
            { this.state.isLoading ?
              <Loading />
              :
              <div>
                { this.state.words.map((word, index) => {
                  return (
                    <div className="input-group mb-3" key="{index}">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{word.value}</span>
                      </div>
                      <button type="button" className="btn btn-danger" onClick={ () => this.delete(word.value) }> 
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                )}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default wordsBag;