
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('testdb', 'root', 'root', {
  dialect: 'mysql' // or 'postgres'
});

const Form = sequelize.define('Form', {
  uniqueId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  isGraduate: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

const app = express();
app.use(bodyParser.json());




// Fill data route
app.post('/fill_data/form_id/:form_id/user', async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.form_id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    const data = await form.update(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all data route
app.get('/fill_data/form_id/:form_id/user', async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { uniqueId: req.params.form_id }
    });
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Route to create a form
app.post('/form', async (req, res) => {
  try {
    const { uniqueId, title, email, phoneNumber, isGraduate } = req.body;
    const form = await Form.create({ uniqueId, title, email, phoneNumber, isGraduate });
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


