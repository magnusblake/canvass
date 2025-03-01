"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUpload from "@/components/profile-image-upload";
import { CheckCircle, ChevronLeft, CreditCard, Save, User, Shield, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import PremiumBadge from "@/components/premium-badge";

export default function ProfileSettingsPage() {
  const { user, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    country: "",
    interests: "",
    vkLink: "",
    behanceLink: "",
    telegramLink: ""
  });
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Настройки уведомлений
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    followers: true,
    messages: true,
    updates: false,
    newsletter: false
  });
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        country: user.country || "",
        interests: (user.interests || []).join(", "),
        vkLink: user.vkLink || "",
        behanceLink: user.behanceLink || "",
        telegramLink: user.telegramLink || ""
      });
      
      setAvatarUrl(user.image);
      setBannerUrl(user.banner);
    }
  }, [user, isLoading, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Преобразуем строку с интересами в массив
    const interests = formData.interests
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          interests,
          image: avatarUrl,
          banner: bannerUrl
        })
      });
      
      if (response.ok) {
        toast.success("Профиль успешно обновлен", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        updateUser({
          ...formData,
          interests,
          image: avatarUrl,
          banner: bannerUrl
        });
      } else {
        toast.error("Не удалось обновить профиль");
      }
    } catch (error) {
      toast.error("Произошла ошибка");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };
  
  const handleCancelPremium = async () => {
    try {
      const response = await fetch("/api/premium", {
        method: "POST"
      });
      
      if (response.ok) {
        const data = await response.json();
        updateUser({ premium: data.premium });
        toast.success("Премиум-подписка отменена");
      } else {
        toast.error("Не удалось отменить подписку");
      }
    } catch (error) {
      toast.error("Произошла ошибка");
    }
  };
  
  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse">Загрузка...</div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <div className="md:w-64 space-y-4">
            <div className="flex items-center mb-6">
              <Link href={`/profile/${user.id}`} className="text-muted-foreground flex items-center hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Назад к профилю
              </Link>
            </div>
            
            <div className="sticky top-20">
              <h1 className="text-2xl font-bold mb-6">Настройки</h1>
              
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "general" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("general")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </Button>
                
                <Button
                  variant={activeTab === "subscription" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("subscription")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Подписка
                </Button>
                
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Уведомления
                </Button>
                
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Безопасность
                </Button>
                
                <Separator className="my-4" />
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </nav>
            </div>
          </div>
          
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Настройки профиля</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Фотографии профиля</CardTitle>
                      <CardDescription>
                        Загрузите фотографии для вашего профиля
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Баннер профиля</Label>
                        <ProfileImageUpload
                          type="banner"
                          currentUrl={bannerUrl}
                          onUpload={setBannerUrl}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Аватар</Label>
                        <ProfileImageUpload
                          type="avatar"
                          currentUrl={avatarUrl}
                          onUpload={setAvatarUrl}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Личная информация</CardTitle>
                      <CardDescription>
                        Обновите вашу личную информацию
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Имя пользователя</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country">Страна</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">О себе</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Расскажите о себе, своём опыте и специализации..."
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="interests">Интересы (через запятую)</Label>
                          <Input
                            id="interests"
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="дизайн, типографика, 3D..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Социальные сети</CardTitle>
                      <CardDescription>
                        Добавьте ссылки на ваши социальные сети
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vkLink">VK</Label>
                        <Input
                          id="vkLink"
                          name="vkLink"
                          value={formData.vkLink}
                          onChange={handleChange}
                          placeholder="https://vk.com/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="behanceLink">Behance</Label>
                        <Input
                          id="behanceLink"
                          name="behanceLink"
                          value={formData.behanceLink}
                          onChange={handleChange}
                          placeholder="https://behance.net/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telegramLink">Telegram</Label>
                        <Input
                          id="telegramLink"
                          name="telegramLink"
                          value={formData.telegramLink}
                          onChange={handleChange}
                          placeholder="https://t.me/username"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto" disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Сохранение..." : "Сохранить изменения"}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </div>
            )}
            
            {activeTab === "subscription" && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Управление подпиской</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Текущая подписка</CardTitle>
                    <CardDescription>
                      Информация о вашей текущей подписке
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Статус:</h3>
                        {user.premium ? (
                          <div className="flex items-center">
                            <span className="text-primary font-medium">Активна</span>
                            <PremiumBadge className="ml-2" />
                          </div>
                        ) : (
                          <span>Стандартный план</span>
                        )}
                      </div>
                      
                      {user.premium ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/canvasx">
                            Посмотреть преимущества
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link href="/canvasx">
                            Перейти на CanvasX
                          </Link>
                        </Button>
                      )}
                    </div>
                    
                    {user.premium && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <h4 className="text-sm text-muted-foreground">План</h4>
                            <p>CanvasX Месячный</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground">Стоимость</h4>
                            <p>399 ₽ / месяц</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground">Следующий платеж</h4>
                            <p>15 апреля 2025</p>
                          </div>
                          <div>
                            <h4 className="text-sm text-muted-foreground">Метод оплаты</h4>
                            <p>•••• 4242</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Управление подпиской</h4>
                          
                          <div className="space-y-2">
                            <Button variant="outline" asChild>
                              <Link href="/subscription/payment-methods">
                                Изменить способ оплаты
                              </Link>
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={handleCancelPremium}
                            >
                              Отменить подписку
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              При отмене подписки вы сохраните доступ к премиум-функциям до окончания текущего 
                              платежного периода.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {!user.premium && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Перейти на CanvasX</CardTitle>
                      <CardDescription>
                        Разблокируйте все премиум-функции платформы
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Преимущества подписки CanvasX:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>Неограниченное количество проектов</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>Загрузка файлов до 100 МБ</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>Эксклюзивный бейдж профиля</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>Расширенная аналитика</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/canvasx">
                          Перейти на CanvasX
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Настройки уведомлений</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления на платформе</CardTitle>
                    <CardDescription>
                      Настройте, какие уведомления вы хотите получать
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Лайки на проекты</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления, когда кто-то лайкает ваши проекты
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.likes} 
                          onCheckedChange={() => handleToggleNotification("likes")} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Комментарии</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления о комментариях к вашим проектам
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.comments} 
                          onCheckedChange={() => handleToggleNotification("comments")} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Новые подписчики</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления, когда кто-то подписывается на вас
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.followers} 
                          onCheckedChange={() => handleToggleNotification("followers")} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Сообщения</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления о новых сообщениях
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.messages} 
                          onCheckedChange={() => handleToggleNotification("messages")} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Email-уведомления</CardTitle>
                    <CardDescription>
                      Настройте, какие уведомления вы хотите получать на email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Обновления платформы</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления о новых функциях и обновлениях
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.updates} 
                          onCheckedChange={() => handleToggleNotification("updates")} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Рассылка</h3>
                          <p className="text-sm text-muted-foreground">
                            Получать нашу ежемесячную рассылку
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.newsletter} 
                          onCheckedChange={() => handleToggleNotification("newsletter")} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="ml-auto">
                      Сохранить настройки
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === "security" && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold">Безопасность аккаунта</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Изменение пароля</CardTitle>
                    <CardDescription>
                      Обновите пароль для входа в аккаунт
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Текущий пароль</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Новый пароль</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="ml-auto">
                      Обновить пароль
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Двухфакторная аутентификация</CardTitle>
                    <CardDescription>
                      Повысьте безопасность вашего аккаунта
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Двухфакторная аутентификация</h3>
                          <p className="text-sm text-muted-foreground">
                            Добавьте дополнительный уровень защиты для вашего аккаунта
                          </p>
                        </div>
                        <Button variant="outline">
                          Включить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Сеансы</CardTitle>
                    <CardDescription>
                      Устройства, на которых вы вошли в аккаунт
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Chrome на Windows</h3>
                          <p className="text-sm text-muted-foreground">
                            Москва, Россия • Активен сейчас
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Выйти
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                      <div>
                          <h3 className="font-medium">Safari на iPhone</h3>
                          <p className="text-sm text-muted-foreground">
                            Москва, Россия • Последняя активность: 2 часа назад
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Выйти
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto">
                      Выйти со всех устройств
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Удаление аккаунта</CardTitle>
                    <CardDescription>
                      Удаление аккаунта приведет к полной потере всех данных
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Все ваши проекты, комментарии и личные данные будут безвозвратно удалены.
                      Этот процесс не может быть отменен.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive">
                      Удалить аккаунт
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}