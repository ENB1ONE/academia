import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import logo from '../../assets/formclub-logo.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }

    try {
      setIsLoading(true);
      // Simulaçǜo de chamada  API para a apresentao
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSent(true);
      toast.success('Instrues enviadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <img
          className="mx-auto h-32 w-auto object-contain drop-shadow-xl"
          src={logo}
          alt="FormClub"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
          Esqueceu a senha?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Vamos te ajudar a recuperar o acesso  sua conta.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="shadow-2xl border-gray-800 backdrop-blur-sm bg-surface/80">
          {!isSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email cadastrado"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Enviar Link de Recuperação
              </Button>

              <div className="text-center mt-4">
                <Link to="/" className="text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Verifique seu Email</h3>
              <p className="text-gray-400 mb-8">
                Enviamos um link de recuperação para <br/>
                <strong className="text-white">{email}</strong>
              </p>
              <Link to="/">
                <Button className="w-full" variant="outline">
                  Voltar para o Início
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
