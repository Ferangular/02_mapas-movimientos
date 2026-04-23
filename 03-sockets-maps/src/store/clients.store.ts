import type { ClientMarker, LatLng } from '../types';

interface ClientsStoreState {
  clients: Map<string, ClientMarker>;
}

export class ClientsStore {
  private state: ClientsStoreState = {
    clients: new Map<string, ClientMarker>(),
  };

  getAll(): ClientMarker[] {
    return Array.from(this.state.clients.values());
  }

  getById(clientId: string): ClientMarker | undefined {
    return this.state.clients.get(clientId);
  }

  has(clientId: string): boolean {
    return this.state.clients.has(clientId);
  }

  add(client: ClientMarker): void {
    this.state.clients.set(client.clientId, client);
  }

  updateCoords(clientId: string, coords: LatLng): ClientMarker | undefined {
    const existingClient = this.getById(clientId);
    if (!existingClient) return undefined;

    const updatedClient: ClientMarker = {
      ...existingClient,
      coords,
      updatedAt: Date.now(),
    };

    this.state.clients.set(clientId, updatedClient);
    return updatedClient;
  }

  remove(clientId: string): boolean {
    return this.state.clients.delete(clientId);
  }
}
