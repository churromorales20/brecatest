const express = require('express');
const dashboardRoutes = express.Router();
let csvToJson = require('convert-csv-to-json');
let moment = require('moment');

let sqlite3 = require('sqlite3').verbose();
let today = moment();
let lastmonth = moment().subtract(1, 'month').startOf('month');
const loadVenues = () => {
  return csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/venues.csv");
}
const calculateVenuesSales = (sale, venue_sales, venues) => {
  let venue_data = venue_sales.find(venue => venue.id === sale.venue_id);
  if(venue_data === undefined){
    let venue = venues.find(venue => venue.id === sale.venue_id);
    venue_sales.push({
      historic : {
        amount: 0,
        transactions: 0,
      },
      last_month : {
        amount: 0,
        transactions: 0,
      },
      month : {
        amount: 0,
        transactions: 0,
      },
      id : sale.venue_id,
      name_venue: venue.name
    });
    venue_data = venue_sales[venue_sales.length - 1];
  }
  sale.num_sales = parseFloat(sale.num_sales);
  sale.num_transactions = parseFloat(sale.num_transactions);
  let sale_date = moment(sale.date);
  if(sale_date.isSame(today, 'month')){
    venue_data.month.amount += sale.num_sales;
    venue_data.month.transactions += sale.num_transactions;
  }
  if(sale_date.isSame(lastmonth, 'month')){
    venue_data.last_month.amount += sale.num_sales;
    venue_data.last_month.transactions += sale.num_transactions;
  }
  venue_data.historic.amount += sale.num_sales;
  venue_data.historic.transactions += sale.num_transactions;
}
const loadTenants = () => {
  let tenants = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/tenants.csv");
  let sstenants = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/ss_tenants.csv");
  return {
    tenants: tenants,
    sst: sstenants
  };
}
const calculateTenantSales = (sale, tenants, venues, tenant_sales) => {
  let sstenants = tenants.sst;
  let sst = sstenants.find((sst) => sst.ss_tenant_id === sale.ss_tenant_id);
  if(sst === undefined){
    sst = {
      id: 0
    }
  }
  let tenant = tenants.tenants.find((tenant) => tenant.id === sst.tenant_id);
  if(tenant === undefined){
    tenant = {
      id: 0
    }
  }
  let sale_data = tenant_sales.find((tsale) => tsale.tenant_id === tenant.id);
  if(sale_data === undefined){
    tenant_sales.push({
      tenant_id: tenant.id,
      historic : {
        amount: 0,
        transactions: 0,
      },
      last_month : {
        amount: 0,
        transactions: 0,
      },
      month : {
        amount: 0,
        transactions: 0,
      },
      name : sale.ss_tenant_name
    });
    sale_data = tenant_sales[tenant_sales.length - 1];
  }
  let sale_date = moment(sale.date);
  if(sale_date.isSame(today, 'month')){
    sale_data.month.amount += sale.num_sales;
    sale_data.month.transactions += sale.num_transactions;
  }
  if(sale_date.isSame(lastmonth, 'month')){
    sale_data.last_month.amount += sale.num_sales;
    sale_data.last_month.transactions += sale.num_transactions;
  }
  sale_data.historic.amount += sale.num_sales;
  sale_data.historic.transactions += sale.num_transactions;
}
const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
}
// Defined delete | remove | destroy route
dashboardRoutes.route('/tenantvisits').get(function (req, res) {
  let areas = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/areas.csv");
  areas.forEach((area) => {
    area.id = replaceAll(area.id, '"', '');
  });
  let visits = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/counts.csv");
  let tenants_visits = [];
  let tenants = loadTenants();
  visits.forEach((visit) => {
    let varea = areas.find((area) => area.id === visit.area_id);
    let vt = tenants.tenants.find((vte) => vte.id === varea.tenant_id);
    let tvisit = tenants_visits.find((tvisit) => tvisit.tenant_id === varea.tenant_id);
    // if(vt === undefined){
    //   console.log(varea.tenant_id);
    // }
    if(tvisit === undefined){
      tenants_visits.push({
        tenant_id: varea.tenant_id,
        visits: 0,
        pass: 0,
        brand: vt === undefined ? 'UNKNOWN' : vt.brand
      });
      tvisit = tenants_visits[tenants_visits.length - 1];
    }
    tvisit.visits += parseInt(visit.num_ingress);
    tvisit.pass += parseInt(visit.num_transit);
  });
  res.json({
    tenants_visits: tenants_visits,
  });
});
dashboardRoutes.route('/bestsellers').get(function (req, res) {
  let sales = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/sales.csv");
  let venue_sales = [];
  let tenant_sales = [];
  let venues = loadVenues();
  let tenants = loadTenants();
  sales.forEach((sale) => {
    calculateVenuesSales(sale, venue_sales, venues);
    calculateTenantSales(sale, tenants, venues, tenant_sales);
  });
  res.json({
    venues_sales: venue_sales,
    tenant_sales : tenant_sales
  });
});
dashboardRoutes.route('/marketingscreen').get(function (req, res) {
  let db = new sqlite3.Database('./db/chinook.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  });
  let sql_create = 'CREATE TABLE IF NOT EXISTS birthday (venue TEXT, gender TEXT, st INTEGER)';
  let venue_selected = '*';
  let gender_selected = '*';
  let send_present = false;
  let venues = loadVenues();
  db.run(sql_create, () => {
    let sql = 'SELECT * FROM birthday';
    db.get(sql, [], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if(row){
        venue_selected = row.venue;
        gender_selected = row.gender;
        send_present = row.st === 1 ? true : false;
      }
      res.json({
        venues: venues,
        send_present : send_present,
        venue_selected: venue_selected,
        gender_selected: gender_selected
      });
    });
  });
  db.close();

});
dashboardRoutes.route('/popularvisits').get(function (req, res) {
  let venues = loadVenues();
  let visits = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/visits.csv");
  let vvisits = [];
  visits.forEach((visit) => {
    let visit_item = vvisits.find((vvisit) => vvisit.venue_id === visit.venue_id);
    if(visit_item === undefined){
      vvisits.push({
        venue_id: visit.venue_id,
        visits: 0
      });
      visit_item = vvisits[vvisits.length - 1];
    }
    visit_item.visits += 1;
  });
  vvisits.forEach((vis) => {
    let venue = venues.find((venue) => venue.id === vis.venue_id);
    vis.venue_name = venue.name;
  });
  res.json({
    visits: vvisits,
  });
});
dashboardRoutes.route('/socialpopular').get(function (req, res) {
  let likes = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/likes.csv");
  let pages = csvToJson.fieldDelimiter(',').getJsonFromCsv("../data/pages.csv");
  let tenants = loadTenants();
  let pages_like = [];
  pages.forEach((page) => {
    let tenant = tenants.tenants.find((tlike) => tlike.brand === page.brand);
    if(tenant !== undefined){
      pages_like.push({
        clean_name: page.clean_name,
        tenant : tenant
      });
    }
  });
  let tenants_like = [];
  likes.forEach((like) => {
    let page_like = pages_like.find((page) => page.clean_name === like.clean_name);
    if(page_like !== undefined){
      let tenant_like = tenants_like.find((tlike) => tlike.tenant_id === page_like.tenant.id);
      if(tenant_like === undefined){
        tenants_like.push({
          likes: 0,
          tenant_id: page_like.tenant.id,
          page_name: page_like.clean_name
        });
        tenant_like = tenants_like[tenants_like.length - 1];
      }
      tenant_like.likes += 1;
    }
  });
  res.json({
    likes_tenant: tenants_like,
  });
});
module.exports = dashboardRoutes;
