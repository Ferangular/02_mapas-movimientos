import type {
  ClientMovePayload,
  ClientRegisterPayload,
} from '../schemas/websocket-message.schema';
import { ClientsStore } from '../store/clients.store';
import type { ClientMarker } from '../types';

class ClientsService {
  private readonly clientsStore: ClientsStore;

  constructor() {
    this.clientsStore = new ClientsStore();
  }

  getAllClients() {
    return this.clientsStore.getAll();
  }

  registerClient(
    input: ClientRegisterPayload
  ): { error: string } | ClientMarker {
    if (this.clientsStore.has(input.clientId)) {
      return { error: 'Client already register' };
    }

    const client: ClientMarker = {
      ...input,
      updatedAt: Date.now(),
      color: input.color || 'gray',
    };

    this.clientsStore.add(client);
    return client;
  }

  clientMoved(
    clientId: string,
    input: ClientMovePayload
  ): { error: string } | ClientMarker {
    const client = this.clientsStore.getById(clientId);

    if (!client) {
      return { error: 'Client not register.' };
    }

    const updatedClient = this.clientsStore.updateCoords(
      clientId,
      input.coords
    );

    if (!updatedClient) {
      return { error: 'Could not move client. Client not found' };
    }

    return updatedClient;
  }

  removeClient(clientId: string) {
    return this.clientsStore.remove(clientId);
  }
}

export const clientsService = new ClientsService();
