// Gladio Worker: Fetch latest 100 orders
// Returns JSON array of OrderRow objects

type OrderRow = {
  Id: string;
  CustomerName: string;
  OrderDate: number;
};

export default {
  async fetch(request: Request, env: any) {
    const result = await env.MY_DB.prepare(
      "SELECT Id, CustomerName, OrderDate FROM [Order] ORDER BY ShippedDate DESC LIMIT 100"
    ).run<OrderRow>();
    return new Response(
      JSON.stringify(result),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
