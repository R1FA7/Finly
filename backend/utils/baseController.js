import xlsx from "xlsx";

export const createCRUDController = (model, validationSchema) => ({
  getAll: async (req, res) => {
    const userId = req.user?.id;
    try {
      const records = await model.find({ userId }).sort({ date: -1 });
      res.status(200).json({
        success: true,
        message: `${model.modelName} fetched successfully`,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        errors: error.message,
      });
    }
  },

  add: async (req, res) => {
    const userId = req.user?.id;

    try {
      await validationSchema.validate(req.body, { abortEarly: false });

      const { icon, source, amount, date } = req.body;

      const newRecord = await model.create({
        userId,
        icon,
        source,
        amount,
        date: new Date(date),
      });

      res.status(201).json({
        success: true,
        message: `${model.modelName} added successfully`,
        data: newRecord,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        message: "Server Error",
        errors: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: `${model.modelName} deleted successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        errors: error.message,
      });
    }
  },

  downloadExcel: async (req, res) => {
    const userId = req.user?.id;

    try {
      const records = await model.find({ userId }).sort({ date: -1 });

      const formatted = records.map((r) => ({
        Source: r.source,
        Amount: r.amount,
        Date: r.date,
      }));

      const ws = xlsx.utils.json_to_sheet(formatted);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Data");

      const filename = `${model.modelName.toLowerCase()}_details.xlsx`;
      xlsx.writeFile(wb, filename);
      res.download(filename);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        errors: error.message,
      });
    }
  },
});
