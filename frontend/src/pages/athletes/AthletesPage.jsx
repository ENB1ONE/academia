import React, { useState } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const mockAthletes = [
  { id: 1, name: 'Lucas Silva', age: 24, sport: 'Futebol', position: 'Atacante', lastActivity: 'Hoje' },
  { id: 2, name: 'Pedro Santos', age: 22, sport: 'Futebol', position: 'Meio-campo', lastActivity: 'Ontem' },
  { id: 3, name: 'Marcos Oliveira', age: 26, sport: 'Vôlei', position: 'Ponteiro', lastActivity: 'Há 2 dias' },
  { id: 4, name: 'Rafael Costa', age: 21, sport: 'Basquete', position: 'Armador', lastActivity: 'Hoje' },
  { id: 5, name: 'Thiago Pereira', age: 28, sport: 'Natação', position: 'Livre', lastActivity: 'Hoje' },
];

const AthletesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddAthlete = (e) => {
    e.preventDefault();
    toast.success('Atleta adicionado com sucesso!');
    setIsModalOpen(false);
  };

  const filteredAthletes = mockAthletes.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Atletas</h1>
          <p className="text-gray-400 mt-1">Gerencie seus atletas e equipes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Atleta
        </Button>
      </div>

      <Card padding="p-4">
        <Input 
          placeholder="Buscar por nome ou modalidade..." 
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAthletes.map(athlete => (
          <Card 
            key={athlete.id} 
            padding="p-5" 
            onClick={() => navigate(`/athletes/${athlete.id}`)}
            className="hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
                {athlete.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-text">{athlete.name}</h3>
                <p className="text-sm text-gray-400">{athlete.sport} • {athlete.position}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400 border-t border-gray-800 pt-3 flex justify-between">
              <span>Idade: {athlete.age} anos</span>
              <span>Ativo: {athlete.lastActivity}</span>
            </div>
          </Card>
        ))}
        
        {filteredAthletes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Nenhum atleta encontrado.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Atleta">
        <form onSubmit={handleAddAthlete} className="space-y-4">
          <Input label="Nome Completo" required placeholder="Ex: João da Silva" icon={User} />
          <Input label="Email" type="email" placeholder="joao@email.com" />
          <Input label="Data de Nascimento" type="date" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Modalidade" placeholder="Ex: Futebol" />
            <Input label="Posição" placeholder="Ex: Goleiro" />
          </div>
          <Button type="submit" className="w-full mt-4">Salvar Atleta</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AthletesPage;
