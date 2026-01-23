INSERT INTO ADMIN_ACCOUNTS (
    ID,
    USERNAME,
    PASSWORD,
    NICKNAME,
    EMAIL,
    ROLE,
    ENABLED,
    CREATED_AT,
    UPDATED_AT,
    CREATED_BY,
    UPDATED_BY
) VALUES (
             1,
             'admin',
             '$2a$10$OcI4R8AZfgv7m02wQEqzfua4qpp7AtVFE/cLknHnoinyEJsy/OOly',
             '관리자',
             'admin@email.com',
             'ADMIN',
             TRUE,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP,
             'SYSTEM',
             'SYSTEM'
         );