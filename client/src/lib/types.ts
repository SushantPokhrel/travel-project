export type CredentialResponseType = {
  credential?: string | undefined;
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session"
    | undefined;
  clientId?: string | undefined;
};
export type User = {
  username: string;
  email: string;
  role: "admin" | "tourist" | "guide" | "pending";
  id: string;
};
export type LoginResponseType = {
  message: string;
  user: User;
};

export type StoreState = {
  user: User | null;
  setUser: (user: User | null) => void;
  userLoader: boolean;
  setUserLoader: (userLoaded: boolean) => void;
};
