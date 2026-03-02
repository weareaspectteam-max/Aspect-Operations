export type Role = "admin" | "staff";

export type User = {
  username: string;
  password: string;
  role: Role;
  mekan?: string; // admin için boş olabilir
};

export const USERS: User[] = [
  { username: "yonetici", password: "yonetici", role: "admin" },

  // staff mutlaka mekan ile
  { username: "personel", password: "personel", role: "staff", mekan: "ZOKA" },

  // test kullanıcılar
  { username: "admin", password: "1234", role: "admin" },
  { username: "zoka1", password: "1111", role: "staff", mekan: "ZOKA" },
];