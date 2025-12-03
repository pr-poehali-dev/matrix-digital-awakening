import { useState } from 'react';
import MatrixRain from '@/components/MatrixRain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedPill, setSelectedPill] = useState<'red' | 'blue' | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPill) {
      toast({
        title: 'Выберите пилюлю',
        description: 'Сделайте свой выбор: красная или синяя',
        variant: 'destructive',
      });
      return;
    }
    if (!email) {
      toast({
        title: 'Введите email',
        description: 'Мы отправим подтверждение на вашу почту',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/cd845677-eb21-47a1-b504-462da8182f19', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pillChoice: selectedPill,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Ошибка регистрации',
          description: data.error || 'Что-то пошло не так',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: selectedPill === 'red' ? '🔴 Красная пилюля принята' : '🔵 Синяя пилюля принята',
        description: `Регистрация успешна! Проверьте ${email}`,
      });
      setEmail('');
      setSelectedPill(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить регистрацию',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matrix-dark text-foreground relative overflow-hidden font-mono">
      <MatrixRain />

      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-matrix animate-matrix-glow mb-6">
            Ты всё ещё в матрице?
          </h1>
          <p className="text-xl md:text-2xl text-primary/80 max-w-3xl mb-12">
            15 – 16 марта — День цифрового пробуждения. 
            <br />
            Пора проверить, кто управляет твоей реальностью.
          </p>

          <div className="flex gap-8 mb-12">
            <button
              onClick={() => setSelectedPill('red')}
              className={`group relative w-32 h-32 md:w-40 md:h-40 rounded-full transition-all ${
                selectedPill === 'red' ? 'animate-pulse-pill' : ''
              }`}
              style={{
                background: 'linear-gradient(145deg, #ff0033, #cc0028)',
                boxShadow: selectedPill === 'red' ? '0 0 60px #ff0033' : '0 0 30px #ff0033',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-orbitron text-lg font-bold">
                ПРАВДА
              </span>
            </button>

            <button
              onClick={() => setSelectedPill('blue')}
              className={`group relative w-32 h-32 md:w-40 md:h-40 rounded-full transition-all ${
                selectedPill === 'blue' ? 'animate-pulse-pill' : ''
              }`}
              style={{
                background: 'linear-gradient(145deg, #0099ff, #0077cc)',
                boxShadow: selectedPill === 'blue' ? '0 0 60px #0099ff' : '0 0 30px #0099ff',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-orbitron text-lg font-bold">
                СОН
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-primary/60">
            <Icon name="ChevronDown" className="animate-bounce" size={32} />
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-matrix text-center mb-4">
              Что это?
            </h2>
            <p className="text-xl text-center text-primary/80 mb-12 max-w-3xl mx-auto">
              Это не просто праздник — это 48 часов экспериментов с реальностью.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: 'Shield', title: 'Отследить зависимости', desc: 'Узнай, сколько времени ты тратишь на цифровой мир' },
                { icon: 'Wifi', title: 'Оффлайн-челленджи', desc: '24 часа без смартфона или GPS' },
                { icon: 'Brain', title: 'Влияние алгоритмов', desc: 'Как соцсети формируют твои решения' },
                { icon: 'Eye', title: 'Цифровая приватность', desc: 'Проверь, кто следит за тобой в сети' },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-all">
                  <Icon name={item.icon} className="text-primary mb-4" size={40} />
                  <h3 className="font-orbitron text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>

            <div className="aspect-video bg-black rounded-lg border border-primary/20 overflow-hidden relative group">
              <video
                className="w-full h-full object-cover"
                controls
                poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80"
              >
                <source src="https://cdn.pixabay.com/video/2023/06/19/167862-839166058_large.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео
              </video>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <p className="text-center text-sm text-primary/60 mt-4">
              Видео-тизер: цифровая матрица, код реальности, пробуждение сознания
            </p>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-matrix text-center mb-12">
              Почему тебе это нужно?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { emoji: '🕵️', type: 'Для параноиков', desc: 'Проверь, следят ли за тобой (мастер-класс по приватности)' },
                { emoji: '🤓', type: 'Для гиков', desc: 'Взлом повседневных алгоритмов (воркшоп по OSINT)' },
                { emoji: '💕', type: 'Для романтиков', desc: 'Свидание без смартфонов (зоны молчания)' },
                { emoji: '⚡', type: 'Для бунтарёв', desc: 'Челлендж "24 часа без GPS"' },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:scale-105 transition-transform">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-orbitron text-lg font-bold text-primary mb-2">{item.type}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>

            <Card className="p-8 bg-card/30 backdrop-blur border-primary/30 max-w-2xl mx-auto">
              <Icon name="Quote" className="text-primary/40 mb-4" size={40} />
              <p className="text-lg text-primary/90 italic mb-4">
                «После прошлого Дня цифрового пробуждения я удалил 3 приложения и нашёл 4 новых хобби»
              </p>
              <p className="text-sm text-muted-foreground">— Алиса, 27 лет</p>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-matrix text-center mb-4">
              Выбери свою пилюлю
            </h2>
            <p className="text-center text-primary/60 mb-12">
              Регистрация открыта до 10 марта. Количество «пилюль» ограничено.
            </p>

            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    Твой выбор:
                  </label>
                  <div className="flex gap-4 justify-center mb-6">
                    <Button
                      type="button"
                      onClick={() => setSelectedPill('red')}
                      variant={selectedPill === 'red' ? 'default' : 'outline'}
                      className={`font-orbitron ${
                        selectedPill === 'red'
                          ? 'bg-[#ff0033] hover:bg-[#cc0028] border-[#ff0033]'
                          : 'border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033]/10'
                      }`}
                    >
                      🔴 Красная пилюля
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedPill('blue')}
                      variant={selectedPill === 'blue' ? 'default' : 'outline'}
                      className={`font-orbitron ${
                        selectedPill === 'blue'
                          ? 'bg-[#0099ff] hover:bg-[#0077cc] border-[#0099ff]'
                          : 'border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff]/10'
                      }`}
                    >
                      🔵 Синяя пилюля
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Email для подтверждения:
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-background/50 border-primary/30 focus:border-primary text-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-orbitron bg-primary hover:bg-primary/90 text-background font-bold text-lg py-6 disabled:opacity-50"
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </Card>

            <div className="mt-12 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary/60">
                <Icon name="Calendar" size={20} />
                <span>15-16 марта 2025</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary/60">
                <Icon name="MapPin" size={20} />
                <span>Онлайн и оффлайн локации в твоём городе</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-4 border-t border-primary/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-orbitron text-lg font-bold text-primary mb-3">Контакты</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="Send" size={16} />
                    <a href="https://t.me/digital_awakening" className="hover:text-primary transition-colors">
                      Telegram-бот
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={16} />
                    <span>info@awakening.digital</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-orbitron text-lg font-bold text-primary mb-3">QR-код</h3>
                <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                  <Icon name="QrCode" size={80} className="text-black" />
                </div>
              </div>

              <div>
                <h3 className="font-orbitron text-lg font-bold text-primary mb-3">Соцсети</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="font-mono text-primary">#ЦифровойПробуждение2025</div>
                  <div className="font-mono text-primary">#ВыходИзМатрицы</div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t border-primary/10 pt-8">
              <p className="font-mono">
                Финал: синхронное отключение гаджетов на 10 минут в 21:00 по местному времени
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;