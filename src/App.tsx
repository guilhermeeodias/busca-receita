import { GiCampCookingPot } from "react-icons/gi"
import { FaArrowLeft, FaUtensilSpoon, FaYoutube } from "react-icons/fa"
import { useState } from 'react'

interface Receita {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
  strCategory: string
  strArea: string
  strYoutube: string
  [key: string]: any
}

function App() {

  const [receitaAtiva, setReceitaAtiva] = useState<Receita | null>(null)
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [busca, setBusca] = useState('')

  async function buscarReceitas() {
    //console.log("buscando por: " + busca)

    if (busca == "") {
      alert("Por favor digite o nome de uma comida!")
      return 
    }

    try {
        const resposta = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busca}`)
        const dados = await resposta.json()
        
        //console.log(dados) 

        if (dados.meals != null) {
          setReceitas(dados.meals)
        } else {
          setReceitas([]) 
          alert("Não achamos nada com esse nome...")
        }

    } catch(erro) {
        console.log("Deu erro: " + erro)
    }
  }

  function getIngredientes(receita: Receita) {
    let lista = []
    
    for (let i = 1; i <= 20; i++) {
      let ingrediente = receita[`strIngredient${i}`]
      let medida = receita[`strMeasure${i}`]

      if (ingrediente != "" && ingrediente != null) {
        lista.push(ingrediente + " - " + medida)
      }
    }
    return lista
  }

  function voltar() {
    setReceitaAtiva(null)
  }

  return (
    <div className="flex flex-col items-center font-sans min-h-screen w-full justify-center bg-orange-50 py-10">
      
      <div className="flex flex-col items-center text-center p-8 mb-10 rounded-2xl bg-emerald-600 w-full max-w-4xl shadow-xl">
       <h1 className="mb-4 mt-2 text-5xl text-white font-extrabold flex justify-center items-center gap-4">
           <GiCampCookingPot /> Acha-Receitas
       </h1>
       <p className="text-2xl text-stone-50">Encontre receitas diversas de comidas (receitas em inglês)</p>
       <p className="text-xl text-stone-100 mt-2">Banco de Dados: <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline font-bold">TheMealDB</a></p>
       
       {receitaAtiva == null && (
       <div className="flex justify-center mt-8 w-full">
         <input 
             value={busca} 
             onChange={(e) => setBusca(e.target.value)} 
             onKeyDown={(e) => {
                 if(e.key === 'Enter'){
                     buscarReceitas()
                 }
             }}
             type="text" 
             className="bg-white rounded-lg pl-4 h-12 w-96 mr-2 outline-none text-gray-700" 
             placeholder="Digite chicken, pie, beef..." 
         />
         <button onClick={buscarReceitas} className="bg-amber-300 hover:bg-amber-400 rounded-lg cursor-pointer w-24 h-12 font-bold text-amber-900 transition-colors">Procurar</button>
       </div>
       )}
      </div>
      
      {receitaAtiva == null && (
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-6">
       
       {receitas.map((item) => (
       <div key={item.idMeal} onClick={() => {
           console.log(item)
           setReceitaAtiva(item)
       }} className="w-80 h-60 bg-blue-200 rounded-[0.4rem] transition-all duration-300 ease-in-out hover:w-96 cursor-pointer hover:shadow-lg overflow-hidden flex flex-col group">
           <img src={item.strMealThumb} alt={item.strMeal} className="w-full h-[60%] object-cover" />
           <div className="h-[40%] flex flex-col items-center justify-center bg-white">
           <h3 className="font-bold text-lg text-gray-800 mb-2 truncate max-w-[90%]">{item.strMeal}</h3>
           <button className="bg-amber-400 text-amber-950 text-sm font-bold py-1 px-4 rounded hover:bg-amber-500 transition-colors">
               Ver Receita
           </button>
           </div>
       </div>
       ))}

      </div>
      )}

      {receitaAtiva != null && (
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 pb-0">
          <button onClick={voltar} className="flex items-center gap-2 text-emerald-700 font-bold text-lg hover:underline cursor-pointer">
              <FaArrowLeft /> Voltar
          </button>
          </div>

          <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
              <img src={receitaAtiva.strMealThumb} className="w-full md:w-1/2 h-80 object-cover rounded-xl shadow-lg" />
              <div className="flex flex-col justify-center">
                  <h2 className="text-4xl font-extrabold text-emerald-800 mb-4">{receitaAtiva.strMeal}</h2>
                  <span className="bg-amber-200 text-amber-900 px-4 py-1 rounded-full text-sm font-bold w-max mb-2">Categoria: {receitaAtiva.strCategory}</span>
                  <span className="bg-blue-200 text-blue-900 px-4 py-1 rounded-full text-sm font-bold w-max">Origem: {receitaAtiva.strArea}</span>
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <FaUtensilSpoon /> Ingredientes
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                  {getIngredientes(receitaAtiva).map((ingrediente, index) => (
                      <li key={index} className="border-b border-orange-200 pb-1">{ingrediente}</li>
                  ))}
                  </ul>
              </div>

              <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">Modo de Preparo</h3>
                  <p className="text-gray-700 leading-relaxed text-lg max-h-96 overflow-y-auto">
                  {receitaAtiva.strInstructions}
                  </p>
                  
                  {receitaAtiva.strYoutube != "" && receitaAtiva.strYoutube != null && (
                  <a href={receitaAtiva.strYoutube} target="_blank" className="mt-6 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-md w-max">
                      <FaYoutube /> Ver no YouTube
                  </a>
                  )}
              </div>
          </div>
          </div>
      </div>
      )}
    </div>
  )
}

export default App