function isUpper(char) {
  return char === char.toUpperCase();
}

let e_map = {};
let d_map = {};
export const hash = async (key) => {
    if (key.length < 10) {
      throw new Error(`Invalid key: Key length should be 94 characters.`);
    } else {
      // Check for repeated characters in the key
      for (let i = 0; i < key.length; i++) {
        for (let j = i + 1; j < key.length; j++) {
          if (key[i] === key[j]) {
            throw new Error(
              `All chars in the key should be distinct and cannot be repeated.`
            );
          }
        }
      }
    }
    // Create a mapping from ASCII characters (32 to 126) to the key
    for (let i = 32, j = 0; i <= 126 && j < key.length; i++, j++) {
      e_map[String.fromCharCode(i)] = key[j];
      d_map[key[j]] = String.fromCharCode(i);
    }
};

export const encrypt = async (password, key) => {
  const hashedPassword = [];
  await hash(key);

  // Hash the password based on the key
  for (let i = 0; i < password.length; i++) {
    hashedPassword.push(e_map[password[i]]);
  }
  return hashedPassword.join("");
};

export const decrypt = async (hashedPassword, key) => {
    let decryptedPassword = [];
      // Decrypt the hashed password based on the key
      await hash(key);
      for (let i = 0; i < hashedPassword.length; i++) {
        decryptedPassword.push(d_map[hashedPassword[i]]);
      }
      return decryptedPassword.join("");
};

// Example usage with a hardcoded key
const key =
  "'ptiF0~C%Pcd2H{`\\]7B}ZraMQ,w|[L3h-?=v;TjI*RG.obOKS:@sfJ<^ke/VN$&Xgm5!Wyl+9EA1z8Yq)#xu>4_ n(6DU\"";
