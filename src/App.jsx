import { useState, useEffect } from 'react';

const HEADERS = {
  'X-Parse-Application-Id': import.meta.env.VITE_APP_ID,
  'X-Parse-REST-API-Key': import.meta.env.VITE_REST_KEY,
  'Content-Type': 'application/json'
};
const URL = 'https://parseapi.back4app.com/parse/classes/Tarefa';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState('');

  useEffect(() => {
    fetch(URL, { headers: HEADERS })
      .then(r => r.json())
      .then(dados => setTarefas(dados.results || []))
      .catch(erro => console.error('Erro ao carregar tarefas:', erro));
  }, []);

  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novoTitulo.trim()) return;

    fetch(URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ titulo: novoTitulo })
    })
      .then(r => r.json())
      .then(dadosCriados => {
        setTarefas([...tarefas, { objectId: dadosCriados.objectId, titulo: novoTitulo }]);
        setNovoTitulo('');
      })
      .catch(erro => console.error('Erro ao adicionar tarefa:', erro));
  };

  const excluirTarefa = (objectId) => {
    fetch(`${URL}/${objectId}`, {
      method: 'DELETE',
      headers: HEADERS
    })
      .then(() => {
        setTarefas(tarefas.filter(t => t.objectId !== objectId));
      })
      .catch(erro => console.error('Erro ao excluir tarefa:', erro));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Minha Lista de Tarefas</h2>

      <form onSubmit={adicionarTarefa} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Adicionar</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefas.map(tarefa => (
          <li
            key={tarefa.objectId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            <span>{tarefa.titulo}</span>
            <button
              onClick={() => excluirTarefa(tarefa.objectId)}
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;