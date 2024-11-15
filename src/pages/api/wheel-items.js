export default function handler(req, res) {
    const items = ["100 Puan", "200 Puan", "300 Puan", "Kaybettin", "Tekrar Dene", "500 Puan"];
    res.status(200).json(items);
}
