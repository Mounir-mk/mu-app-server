const jwt = require("jsonwebtoken");

// Créez la route pour le rafraîchissement du token
const refresh = (req, res) => {
  const refreshToken = req.body.refresh;

  // Vérifiez si le token de rafraîchissement est présent
  if (!refreshToken) {
    return res
      .status(400)
      .json({ message: "Le token de rafraîchissement est requis." });
  }

  try {
    // Vérifiez et décodez le token de rafraîchissement
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(decoded, new Date().getTime());

    // Générez un nouveau token d'accès
    const token = jwt.sign(
      { sub: decoded.sub, role: decoded.role, id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: 121,
      }
    );

    // Renvoyez le nouveau token d'accès
    res.send({ token });
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors du rafraîchissement du token.",
    });
  }
};

const checkRefreshToken = (req, res) => {
  const refreshToken = req.body.refresh;

  // Vérifiez si le token de rafraîchissement est présent
  if (!refreshToken) {
    return res
      .status(400)
      .json({ message: "Le token de rafraîchissement est requis." });
  }

  try {
    // Vérifiez et décodez le token de rafraîchissement
    jwt.verify(refreshToken, process.env.JWT_SECRET);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { refresh, checkRefreshToken };
