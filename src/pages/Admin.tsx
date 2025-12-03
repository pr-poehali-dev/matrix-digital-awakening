import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Registration {
  id: number;
  email: string;
  pill_choice: 'red' | 'blue';
  registered_at: string;
  is_confirmed: boolean;
}

const Admin = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'red' | 'blue'>('all');
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!adminSecret) {
      toast({
        title: 'Введите пароль',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/e22dc775-aa40-4376-871c-9a012b25c4a1', {
        headers: {
          'X-Admin-Secret': adminSecret,
        },
      });

      if (!response.ok) {
        toast({
          title: 'Неверный пароль',
          variant: 'destructive',
        });
        return;
      }

      const data = await response.json();
      setRegistrations(data.registrations);
      setIsAuthenticated(true);
      toast({
        title: 'Вход выполнен',
        description: `Найдено ${data.total} регистраций`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка подключения',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (filter === 'all') return true;
    return reg.pill_choice === filter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-matrix-dark text-foreground flex items-center justify-center px-4 font-mono">
        <Card className="p-8 max-w-md w-full bg-card/50 backdrop-blur border-primary/20">
          <div className="text-center mb-6">
            <Icon name="Shield" className="text-primary mx-auto mb-4" size={64} />
            <h1 className="font-orbitron text-3xl font-bold text-matrix mb-2">Админ-панель</h1>
            <p className="text-sm text-muted-foreground">Введите секретный код для доступа</p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Секретный код"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-background/50 border-primary/30 text-primary"
            />
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full font-orbitron bg-primary hover:bg-primary/90 text-background"
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Подсказка: matrix_admin_2025
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matrix-dark text-foreground px-4 py-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-matrix mb-2">Регистрации</h1>
            <p className="text-muted-foreground">Всего участников: {registrations.length}</p>
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setAdminSecret('');
              setRegistrations([]);
            }}
            variant="outline"
            className="border-primary/30 text-primary"
          >
            Выход
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-primary text-background' : 'border-primary/30 text-primary'}
          >
            Все ({registrations.length})
          </Button>
          <Button
            onClick={() => setFilter('red')}
            variant={filter === 'red' ? 'default' : 'outline'}
            className={filter === 'red' ? '' : 'border-[#ff0033] text-[#ff0033]'}
            style={filter === 'red' ? { background: '#ff0033' } : {}}
          >
            🔴 Красные ({registrations.filter((r) => r.pill_choice === 'red').length})
          </Button>
          <Button
            onClick={() => setFilter('blue')}
            variant={filter === 'blue' ? 'default' : 'outline'}
            className={filter === 'blue' ? '' : 'border-[#0099ff] text-[#0099ff]'}
            style={filter === 'blue' ? { background: '#0099ff' } : {}}
          >
            🔵 Синие ({registrations.filter((r) => r.pill_choice === 'blue').length})
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredRegistrations.map((reg) => (
            <Card key={reg.id} className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: reg.pill_choice === 'red' ? '#ff0033' : '#0099ff',
                    }}
                  >
                    {reg.pill_choice === 'red' ? '🔴' : '🔵'}
                  </div>
                  <div>
                    <div className="font-mono text-lg text-primary">{reg.email}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {reg.id} • {new Date(reg.registered_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div>
                  {reg.is_confirmed ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <Icon name="CheckCircle" size={20} />
                      <span className="text-sm">Подтверждён</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Icon name="Clock" size={20} />
                      <span className="text-sm">Ожидание</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Inbox" className="mx-auto mb-4 opacity-50" size={64} />
              <p>Регистрации не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
