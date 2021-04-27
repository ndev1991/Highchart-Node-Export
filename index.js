/**
 * Required External Modules
 */
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const chartExporter = require("highcharts-export-server");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const chartOptions = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Heading of Chart",
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y}",
      },
    },
  },
};

const getRandomSeries = () => {
  return [
    {
      data: [
        {
          name: "a",
          y: Math.floor(Math.random() * 100),
        },
        {
          name: "b",
          y: Math.floor(Math.random() * 100),
        },
        {
          name: "c",
          y: Math.floor(Math.random() * 100),
        },
      ],
    },
  ];
};

const getRandomOptions = (
  type = "pie",
  title = "HighChart",
  series = getRandomSeries()
) => {
  return {
    chart: {
      type,
    },
    title: {
      text: title,
    },
    series: series,
  };
};

/**
 * App Configuration
 */

app.use(cors(corsOptions));
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/")));

/**
 * Routes Definition
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/png-report", (req, res) => {
  chartExporter.initPool();
  const chartDetails = {
    type: "png",
    options: getRandomOptions(),
  };
  chartExporter.export(chartDetails, (err, chartRes) => {
    if (err) {
      return res.render("png", { title: "PNG" });
    }
    // Get the image data (base64)
    let imageb64 = chartRes.data;
    // Filename of the output
    fs.writeFileSync("public/bar.png", imageb64, "base64", function (err) {
      if (err) console.log(err);
    });
    console.log("PNG image!");
    chartExporter.killPool();

    res.render("png", { title: "PNG" });
  });
});

app.get("/jpg-report", (req, res) => {
  chartExporter.initPool();
  const chartDetails = {
    type: "jpg",
    options: getRandomOptions(),
  };
  chartExporter.export(chartDetails, (err, chartRes) => {
    if (err) {
      return res.render("jpg", { title: "JPG" });
    }
    // Get the image data (base64)
    let imageb64 = chartRes.data;
    // Filename of the output
    fs.writeFileSync("public/bar.jpg", imageb64, "base64", function (err) {
      if (err) console.log(err);
    });
    console.log("JPG image!");
    chartExporter.killPool();

    res.render("jpg", { title: "JPG" });
  });
});

app.post("/base64-report", (req, res) => {
  const { data } = req.body;
  chartExporter.initPool();
  const chartDetails = {
    type: "png",
    options: data,
  };
  chartExporter.export(chartDetails, (err, chartRes) => {
    if (err) {
      return res.render("base64", { title: "Base64" });
    }
    // Get the image data (base64)
    let imageb64 = chartRes.data;
    chartExporter.killPool();

    res.status(200).send({
      data: imageb64,
    });
  });
});

app.get("/svg-report", (req, res) => {
  chartExporter.initPool();
  const chartDetails = {
    type: "svg",
    options: getRandomOptions(),
  };
  chartExporter.export(chartDetails, (err, chartRes) => {
    if (err) {
      return res.render("svg", { title: "SVG" });
    }
    console.log("SVG image!");
    chartExporter.killPool();

    res.render("svg", { title: "SVG", filename: chartRes.filename });
  });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
