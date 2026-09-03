export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Вход
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Пароль"
          className="w-full border rounded-xl p-3 mb-6"
        />

        <button className="w-full bg-black text-white rounded-xl p-3">
          Войти
        </button>
      </div>
    </main>
  );
}