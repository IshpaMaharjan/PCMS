import Vacancy from "../models/Vacancy.model.js";

/* ================= CREATE ================= */
export const createVacancy = async (req, res) => {
  try {
    if (req.user.role !== "professional") {
      return res.status(403).json({ message: "Only professionals can post vacancies" });
    }

    const { title, description, salary, location, contact, experience } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const vacancy = await Vacancy.create({
      title,
      description,
      salary,
      location,
      contact,
      experience,
      author: req.user._id,
    });

    const populatedVacancy = await Vacancy.findById(vacancy._id)
      .populate("author", "_id name role");

    res.status(201).json(populatedVacancy);

  } catch (err) {
    console.error("Create Vacancy Error:", err);
    res.status(500).json({ message: "Server error creating vacancy" });
  }
};

/* ================= GET ================= */
export const getVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find()
      .populate("author", "_id name role")
      .sort({ createdAt: -1 });

    res.status(200).json(vacancies);

  } catch (err) {
    console.error("Fetch Vacancy Error:", err);
    res.status(500).json({ message: "Server error fetching vacancies" });
  }
};

/* ================= DELETE ================= */
export const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    if (
      req.user.role !== "admin" &&
      vacancy.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to delete" });
    }

    await Vacancy.findByIdAndDelete(req.params.id);

    res.json({ message: "Vacancy deleted successfully" });

  } catch (err) {
    console.error("Delete Vacancy Error:", err);
    res.status(500).json({ message: "Server error deleting vacancy" });
  }
};