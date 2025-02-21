import NextAuth, { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { authUsers } from "./db/schema";

interface UserCredentials {
  username: string;
  password: string;
}

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/error',
  },
  secret: process.env.AUTH_SECRET, // Используем новый секрет
  trustHost: true, // Добавляем это для работы в production
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Проверяем и приводим типы credentials
          const validCredentials = credentials as UserCredentials;

          if (!validCredentials?.username || !validCredentials?.password) {
            throw new Error('Отсутствуют учетные данные');
          }

          const user = await db.query.authUsers.findFirst({
            where: eq(authUsers.username, validCredentials.username)
          });

          if (!user || !user.password) {
            throw new Error('Пользователь не найден');
          }

          const isValid = await argon2.verify(user.password, validCredentials.password);

          if (!isValid) {
            throw new Error('Неверный пароль');
          }

          return {
            id: user.id.toString(),
            name: user.username,
            email: user.username,
          };
        } catch (error) {
          console.error('Ошибка аутентификации:', error);
          return null; // NextAuth ожидает null при неудачной аутентификации
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
      }
      return session;
    },
  },
} as NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);





// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   },
//   adapter: DrizzleAdapter(db),
//   providers: [
//     Credentials({
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.username || !credentials?.password) {
//           throw new Error('Отсутствуют учетные данные');
//         }

//         const user = await db.query.authUsers.findFirst({
//           where: eq(authUsers.username, credentials.username)
//         });

//         if (!user) {
//           throw new Error('Пользователь не найден');
//         }

//         try {
//           const isValid = await argon2.verify(user.password, credentials.password);

//           if (!isValid) {
//             throw new Error('Неверный пароль');
//           }

//           return {
//             id: user.id.toString(),
//             name: user.username,
//             email: user.username,
//           };
//         } catch (error) {
//           console.error('Ошибка при проверке пароля:', error);
//           throw new Error('Ошибка аутентификации');
//         }
//       },
//     }),
//   ],
