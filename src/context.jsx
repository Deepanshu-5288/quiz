import { createContext, useContext, useState } from "react";
import axios from "axios";
//const tempUrl = "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";
const table = {
    sports: 21,
    history: 23,
    politics: 24,
  }
  
  const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = createContext();

const AppProvider = (({children}) =>{
    const [waiting, setWaiting] = useState(true);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [index, setIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quiz, setQuiz] = useState({
        amount:10,
        category:"sports",
        difficulty:"meduim"
    })

    const fetchQuestion = async (url) =>{
        setWaiting(false);
        setLoading(true);
        const response = await axios(url).catch((error) => console.log(error));
        if(response){
            const data =response.data.results;
            if(data.length >0){
                setQuestions(data);
                setLoading(false);
                setWaiting(false);
                setError(false);
            }else{
                setError(true);
                setWaiting(true);
            }
          
        }else{
            setWaiting(true);
            setLoading(false);
        }

    }

    const nextQuestion = () => {
        setIndex((oldIndex) => {
          const index = oldIndex + 1
          if (index > questions.length - 1) {
            openModal()
            return 0
          } else {
            return index
          }
        })
      }
      const checkAnswer = (value) => {
        if (value) {
          setCorrect((oldState) => oldState + 1)
        }
        nextQuestion()
      }
    
      const openModal = () => {
        setIsModalOpen(true)
      }
      const closeModal = () => {
        setWaiting(true)
        setCorrect(0)
        setIsModalOpen(false)
      }

    const handleChange =(e) =>{
        const name= e.target.name;
        const value = e.target.value;
        setQuiz({...quiz, [name]:value});
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const {amount, category, difficulty} = quiz;
        const url =`${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;

        fetchQuestion(url);
    }
    
console.log(questions);
    return <AppContext.Provider value={{quiz,waiting, loading, questions, error, index, correct, isModalOpen, closeModal, checkAnswer, nextQuestion, handleChange, handleSubmit}} >{children}</AppContext.Provider>
})


export const useGlobalContext = () =>{
    return useContext(AppContext);
}

export {AppContext, AppProvider};