import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Check, X, CreditCard, Zap, Crown, Clock, Paintbrush, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import PricingCard from "@/components/pricing-card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "CanvasX - Премиум подписка | Canvas",
  description: "Откройте полную мощь Canvas с премиум-подпиской CanvasX",
};

export default async function CanvasXPage() {
  const session = await getSession();
  const user = session?.user ? await getUserById(session.user.id) : null;
  const isPremium = user?.premium || false;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-24 md:pb-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="outline" className="mb-4 bg-white/10 backdrop-blur-sm">
            {isPremium ? "Вы уже подписаны" : "Ограниченное предложение"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="inline-block">Canvas</span>
            <span className="inline-block text-primary">X</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Разблокируйте полный потенциал вашего творчества с премиум-подпиской
          </p>
          {!isPremium && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Оформить подписку
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#benefits">
                  Подробнее
                </Link>
              </Button>
            </div>
          )}
          {isPremium && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/profile/settings">
                Управление подпиской
              </Link>
            </Button>
          )}
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <section id="benefits" className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Преимущества CanvasX</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            CanvasX открывает доступ к эксклюзивным функциям, которые помогут вам выделиться 
            среди других дизайнеров и максимально раскрыть свой творческий потенциал.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Неограниченные загрузки</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Загружайте неограниченное количество проектов, в высоком качестве, без каких-либо ограничений.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Премиум бейдж</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Выделитесь среди других дизайнеров с эксклюзивным премиум-бейджем в профиле.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Ранний доступ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Получайте ранний доступ к новым функциям платформы до их официального релиза.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <Paintbrush className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Расширенная аналитика</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Подробная статистика просмотров, взаимодействий с вашими проектами и демографии аудитории.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Расширенный нетворкинг</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Расширенные возможности для общения с другими дизайнерами и потенциальными клиентами.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Приоритетная поддержка</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Получайте помощь от нашей команды поддержки в приоритетном порядке в любое время.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section id="comparison" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Сравнение планов</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Выберите план, который подходит именно вам
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-background rounded-tl-lg">Функции</th>
                  <th className="p-4 bg-background text-center">Стандарт</th>
                  <th className="p-4 bg-primary text-primary-foreground text-center rounded-tr-lg">CanvasX</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 bg-background">Количество проектов</td>
                  <td className="p-4 bg-background text-center">До 10</td>
                  <td className="p-4 bg-primary/5 text-center font-medium">Без ограничений</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 bg-background">Размер файлов</td>
                  <td className="p-4 bg-background text-center">До 10 МБ</td>
                  <td className="p-4 bg-primary/5 text-center font-medium">До 100 МБ</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 bg-background">Эксклюзивный бейдж</td>
                  <td className="p-4 bg-background text-center">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="p-4 bg-primary/5 text-center">
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 bg-background">Расширенная аналитика</td>
                  <td className="p-4 bg-background text-center">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="p-4 bg-primary/5 text-center">
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 bg-background">Приоритетное ранжирование</td>
                  <td className="p-4 bg-background text-center">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="p-4 bg-primary/5 text-center">
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 bg-background">Ранний доступ к новым функциям</td>
                  <td className="p-4 bg-background text-center">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="p-4 bg-primary/5 text-center">
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 bg-background rounded-bl-lg">Приоритетная поддержка</td>
                  <td className="p-4 bg-background text-center">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="p-4 bg-primary/5 text-center rounded-br-lg">
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <section id="pricing" className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Тарифные планы</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Выберите подходящий для вас план
          </p>
        </div>
        
        <Tabs defaultValue="monthly" className="w-full max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="monthly">Ежемесячно</TabsTrigger>
              <TabsTrigger value="yearly">Ежегодно</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="monthly" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <PricingCard
                title="Стандарт"
                description="Базовый функционал для всех пользователей"
                price="0 ₽"
                duration="в месяц"
                features={[
                  "До 10 проектов",
                  "Файлы до 10 МБ",
                  "Базовая статистика",
                  "Стандартная поддержка"
                ]}
                buttonText="Текущий план"
                disabled={!isPremium}
                buttonVariant="outline"
              />
              
              <PricingCard
                title="CanvasX"
                description="Полный доступ ко всем функциям"
                price="399 ₽"
                duration="в месяц"
                features={[
                  "Неограниченные проекты",
                  "Файлы до 100 МБ",
                  "Расширенная аналитика",
                  "Эксклюзивный бейдж",
                  "Приоритетное ранжирование",
                  "Приоритетная поддержка"
                ]}
                popular={true}
                buttonText={isPremium ? "Управление подпиской" : "Оформить подписку"}
                buttonLink={isPremium ? "/profile/settings" : "/subscription/checkout?plan=monthly"}
                buttonVariant={isPremium ? "outline" : "default"}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <PricingCard
                title="Стандарт"
                description="Базовый функционал для всех пользователей"
                price="0 ₽"
                duration="в год"
                features={[
                  "До 10 проектов",
                  "Файлы до 10 МБ",
                  "Базовая статистика",
                  "Стандартная поддержка"
                ]}
                buttonText="Текущий план"
                disabled={!isPremium}
                buttonVariant="outline"
              />
              
              <PricingCard
                title="CanvasX"
                description="Полный доступ ко всем функциям"
                price="3 999 ₽"
                duration="в год"
                badge="Экономия 20%"
                features={[
                  "Неограниченные проекты",
                  "Файлы до 100 МБ",
                  "Расширенная аналитика",
                  "Эксклюзивный бейдж",
                  "Приоритетное ранжирование",
                  "Приоритетная поддержка"
                ]}
                popular={true}
                buttonText={isPremium ? "Управление подпиской" : "Оформить подписку"}
                buttonLink={isPremium ? "/profile/settings" : "/subscription/checkout?plan=yearly"}
                buttonVariant={isPremium ? "outline" : "default"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Отзывы пользователей</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Что говорят о CanvasX наши пользователи
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/testimonials/user1.jpg"
                      alt="Анна С."
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Анна С.</h3>
                    <p className="text-sm text-muted-foreground">UI/UX дизайнер</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "CanvasX полностью изменил мой рабочий процесс. Расширенная аналитика помогает мне лучше 
                  понимать, как аудитория взаимодействует с моими проектами."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/testimonials/user2.jpg"
                      alt="Максим П."
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Максим П.</h3>
                    <p className="text-sm text-muted-foreground">3D-визуализатор</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Благодаря премиум-подписке я могу загружать проекты в высоком качестве, 
                  что критически важно для моей работы с 3D-визуализациями."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/testimonials/user3.jpg"
                      alt="Елена К."
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Елена К.</h3>
                    <p className="text-sm text-muted-foreground">Графический дизайнер</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Приоритетное ранжирование в поиске привело к значительному увеличению 
                  просмотров моих работ. Это помогло мне найти новых клиентов."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center bg-card border rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Готовы раскрыть свой потенциал?</h2>
          <p className="text-muted-foreground mb-8">
            Присоединяйтесь к тысячам дизайнеров, которые уже выбрали CanvasX для развития 
            своего творческого потенциала и карьеры.
          </p>
          {!isPremium ? (
            <Button size="lg" asChild>
              <Link href="/subscription/checkout?plan=monthly">
                <CreditCard className="mr-2 h-5 w-5" />
                Начать с CanvasX сейчас
              </Link>
            </Button>
          ) : (
            <Button size="lg" variant="outline" asChild>
              <Link href="/profile/settings">
                Управление подпиской
              </Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}