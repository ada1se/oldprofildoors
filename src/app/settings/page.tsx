export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="headline-large" style={{ marginBottom: 4 }}>
          Настройки
        </h1>
        <p
          className="body-large"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Конфигурация системы
        </p>
      </div>

      <div
        className="md3-card-outlined"
        style={{
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <p
          className="body-large"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Страница настроек будет реализована в следующей фазе.
        </p>
      </div>
    </div>
  );
}
