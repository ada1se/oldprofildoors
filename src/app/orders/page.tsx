export default function OrdersPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="headline-large" style={{ marginBottom: 4 }}>
          Заказы
        </h1>
        <p
          className="body-large"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Управление всеми заказами
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
          Страница заказов будет реализована в следующей фазе.
        </p>
      </div>
    </div>
  );
}
