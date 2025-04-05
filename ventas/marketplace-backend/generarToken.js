const jwt = require("jsonwebtoken");

const payload = {
  id: "67e78b636d9917ff897064ed", // ID del usuario
  rol: "admin"
};

const token = jwt.sign(payload, "8YmCQODrFcEienUt", {
  expiresIn: "4h"
});

console.log("✅ Nuevo token:");
console.log(token);
