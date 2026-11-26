import './App.css'

function App() {

  const notas = [
    {
      nf: "10222",
      fornecedor: "Premazon",
      material: "POSTE,CONC,DT,9M",
      valor: "R$ 350,00",
      status: "Regular"
    },
    {
      nf: "43810",
      fornecedor: "Incopostes",
      material: "CRUZETA,CONC,1900MM",
      valor: "R$ 137,13",
      status: "Divergente"
    },
    {
      nf: "43811",
      fornecedor: "Fornecedor A",
      material: "POSTE,CONC,12M",
      valor: "R$ 600,00",
      status: "Regular"
    }
  ]


  return (
    <div className="container">

      <h1>
        Dashboard de Notas Fiscais
      </h1>

      <p>
        Análise de conformidade e divergências
      </p>


      <div className="cards">

        <div className="card">
          <h2>125</h2>
          <span>Notas analisadas</span>
        </div>


        <div className="card">
          <h2>8</h2>
          <span>Divergências</span>
        </div>


        <div className="card">
          <h2>94%</h2>
          <span>Conformidade</span>
        </div>

      </div>


      <h2>
        Últimas Notas
      </h2>


      <table>

        <thead>
          <tr>
            <th>NF</th>
            <th>Fornecedor</th>
            <th>Material</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>


        <tbody>

          {notas.map((nota) => (

            <tr key={nota.nf}>

              <td>{nota.nf}</td>
              <td>{nota.fornecedor}</td>
              <td>{nota.material}</td>
              <td>{nota.valor}</td>
              <td>{nota.status}</td>

            </tr>

          ))}

        </tbody>

      </table>


    </div>
  )
}


export default App