import React, { Component } from "react";
import "./App.css";
//import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/minty/bootstrap.css";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { YMaps, Map } from 'react-yandex-maps';

const PLACES = [
  { name: "Auto", zip: "75001", coord: { latitude: 55.76, longitude: 37.64 } },
  { name: "Ulyanovsk", zip: "432000", coord: { latitude: 54.32, longitude: 48.41 } },
  { name: "Moscow", zip: "83843", coord: { latitude: 55.75, longitude: 37.61 } },
  { name: "Kiev", zip: "03141", coord: { latitude: 50.4, longitude: 30.5 } },
  { name: "Rome", zip: "00199", coord : { latitude: 41.89, longitude: 12.48 } },
  { name: "Barcelona", zip: "08003", coord: { latitude: 41.42, longitude: 2.18 } },
];

class WeatherDisplay extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null
    };
  }

  componentDidMount() {
    const zip = this.props.zip;
    const coordinates = this.props.coordinates;
    var URL = "http://api.openweathermap.org/data/2.5/weather?q=" +
      zip +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric";

    if (coordinates) {
      URL = "http://api.openweathermap.org/data/2.5/weather?lat=" +
        coordinates.latitude +
        "&lon=" +
        coordinates.longitude +
        "&cnt=1&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric";
    };
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json });
    });
  }

  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading</div>;
    const weather = weatherData.weather[0];
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>Current: {weatherData.main.temp}°</p>
        <p>High: {weatherData.main.temp_max}°</p>
        <p>Low: {weatherData.main.temp_min}°</p>
        <p>Wind Speed: {weatherData.wind.speed} km/hr</p>
      </div>
    );
  }
}

class MapDisplay extends Component {
  constructor() {
    super();
    this.state = {
    };
  }


  render() {
    const center = this.props.center;
    return (
      <div>
        <YMaps>
          <div>
            <Map 
              state={{ center: center, zoom: 10 }}
            />
          </div>
        </YMaps>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      activePlace: 1,
      coordinates: 0,
      currentCoordinate: 0,
      center: [42.51, 64.20],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currentCoordinate: { 
            latitude: position.coords.latitude.toFixed(2), 
            longitude: position.coords.longitude.toFixed(2) 
          },
          center: [position.coords.latitude.toFixed(2), position.coords.longitude.toFixed(2)]
        });
      }
    );
  }

  render() {
    const activePlace = this.state.activePlace;
    const coordinates = this.state.coordinates;
    var currentCoordinate = this.state.currentCoordinate;
    const center = this.state.center;
    return (
      <div>
        <Container>
          <Navbar bg="primary">
            <Navbar.Brand>
              Weather
            </Navbar.Brand>
          </Navbar>
        </Container>
        <Container>
          <Row>
            <Col md={4} sm={4}>
              <h3>Select a city</h3>
              <Nav
                className="flex-column"
                variant="pills"
                activeKey={activePlace}
                onSelect={index => {
                  this.setState({ activePlace: index });
                  if (index == 0) {
                    if (!currentCoordinate) {
                      alert("Не удалось определить местоположение, установлено местоположение по умолчанию");
                      this.setState({ coordinates: PLACES[1].coord });
                      this.setState({ activePlace: 1 });
                    } else {
                      this.setState({ coordinates: currentCoordinate });
                      this.setState({ 
                        center: [currentCoordinate.latitude, currentCoordinate.longitude]
                      });
                    };
                  } else {
                    this.setState({ coordinates: PLACES[index].coord });
                    this.setState({ 
                      center: [PLACES[index].coord.latitude, PLACES[index].coord.longitude]
                    });
                  };
                }}
              >
                {PLACES.map((place, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link eventKey={index}>
                      {place.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col md={8} sm={8}>
              <WeatherDisplay 
                key={activePlace} 
                zip={PLACES[activePlace].zip} 
                coordinates={coordinates} 
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <MapDisplay 
            key={activePlace} 
            center={center}
          />
        </Container>
      </div>
    );
  }
}

export default App;
