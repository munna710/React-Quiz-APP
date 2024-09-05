import { useState, useEffect} from 'react';
import './App.css';
import Header from './components/Header';
import Question from './components/Question';
import Results from './components/Results';
import UserForm from './components/UserForm';
import { UserProvider } from './components/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "What's your favorite season?",
    options: ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Autumn 🍂"],
  },
  {
    question: "What's your favorite animal?",
    options: ["Lion 🦁", "Dolphin 🐬", "Elephant 🐘", "Eagle 🦅"],
  },
  {
    question: "What's your favorite type of weather?",
    options: ["Sunny 🌞", "Rainy 🌧️", "Windy 🌬️", "Snowy ❄️"],
  },
  {
    question: "What's your favorite time of day?",
    options: ["Morning 🌅", "Afternoon 🌞", "Evening 🌇", "Night 🌙"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Summer ☀️": "Fire",
  "Winter ❄️": "Water",
  "Spring 🌸": "Earth",
  "Autumn 🍂": "Air",
  "Lion 🦁": "Fire",
  "Dolphin 🐬": "Water",
  "Elephant 🐘": "Earth",
  "Eagle 🦅": "Air",
  "Sunny 🌞": "Fire",
  "Rainy 🌧️": "Water",
  "Windy 🌬️": "Air",
  "Snowy ❄️": "Water",
  "Morning 🌅": "Fire",
  "Afternoon 🌞": "Earth",
  "Evening 🌇": "Air",
  "Night 🌙": "Water",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function (answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b;
    });
  }

  const fetchArtwork = async (element) => {
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${element}`);
      const data = await response.json();
      console.log('API Response:', data); // Log the API response for debugging
  
      if (data.objectIDs && data.objectIDs.length > 0) {
        // Fetch details for the first object ID
        const objectID = data.objectIDs[0];
        const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
        const artworkData = await artworkResponse.json();
        console.log('Artwork Data:', artworkData); // Log the artwork data for debugging
  
        setArtwork(artworkData); // Directly set the fetched artwork data
      } else {
        console.error('No artwork found for the selected element');
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex]
  );
  const resetState = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserName('');
    setElement('');
    setArtwork(null);
  };
  return (
    <Router>
    <UserProvider value={{ name: userName, setName: setUserName }}>
      <Header resetState={resetState} />
      <Routes>
        <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
              />
            ) : (
              <Results element={element} artwork={artwork} resetState={resetState} />
            )
          }
        />
      </Routes>
    </UserProvider>
  </Router>
  );
}

export default App;