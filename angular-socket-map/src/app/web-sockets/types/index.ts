import type { Client, LatLng } from '../../types';

export type ClientMessage =
  | {
      type: 'CLIENT_REGISTER';
      payload: {
        name: string;
        color: string;
        coords: LatLng;
      };
    }
  | {
      type: 'CLIENT_MOVE';
      payload: {
        clientId: string;
        coords: LatLng;
      };
    }
  | {
      type: 'GET_CLIENTS';
      payload?: any; // todo: en un futuro, podemos expandirlo
    };

export type ServerMessage =
  | {
      type: 'ERROR';
      payload: { error: string };
    }
  | {
      type: 'WELCOME';
      payload: Client;
    }
  | {
      type: 'CLIENTS_STATE';
      payload: Client[];
    }
  | {
      type: 'CLIENT_JOINED';
      payload: Client;
    }
  | {
      type: 'CLIENT_MOVED';
      payload: { clientId: string; coords: LatLng; updatedAt: number };
    }
  | {
      type: 'CLIENT_LEFT';
      payload: { clientId: string };
    };
