const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const ipfs = window.IpfsHttpClient.create('http://localhost:5001');


//alert("hi");
const contractAddress = "0x875e10CEb87f739C8dF8b69d024De43A46b77Ef4";
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "string",
        "name": "caseNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "crime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "suspect",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "victim",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "witness",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dateofcrime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "officer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_caseNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_crime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_suspect",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_victim",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_witness",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_dateofcrime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_officer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_status",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_crime",
        "type": "string"
      }
    ],
    "name": "searchRecordByCrime",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "caseNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "crime",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "suspect",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "victim",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "witness",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dateofcrime",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "officer",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "status",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "internalType": "struct UserInfo.User[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]
console.log("Before instantiating contract object");
const userInfoContract = new web3.eth.Contract(contractABI, contractAddress);
console.log(userInfoContract);
console.log("After instantiating contract object");

const form = document.getElementById("add-user-form");
if (form) {
  if (!form.hasAttribute("data-submit-listener")) {
    form.setAttribute("data-submit-listener", "true"); // Add data attribute to mark listener as added
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const caseNumber = document.getElementById("case-number").value;
    const crime = document.getElementById("crime").value;
    const suspect = document.getElementById("suspect").value;
    const victim = document.getElementById("victim").value;
    const witness = document.getElementById("witness").value;
    const dateofcrime = document.getElementById("dateofcrime").value;
    const location = document.getElementById("location").value;
    const officer = document.getElementById("officer").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("investigation-status").value;
    const fileInput = document.getElementById('file');
    // Show confirmation dialog
    const confirmationModal = document.getElementById("confirmation-modal");
    confirmationModal.style.display = "block";

    // Set up event listeners for confirmation buttons
    const confirmYesBtn = document.getElementById("confirm-yes");
    const confirmNoBtn = document.getElementById("confirm-no");

    // Function to handle confirmation "Yes" button click
    const handleConfirmationYes = async () => {
      confirmationModal.style.display = "none";
      try {
        const file = fileInput.files[0]; // Get the selected file
        if (!file) {
          console.error("No file selected.");
          return;
        }
        // Upload the file to IPFS
        console.log("Uploading file to IPFS...");
        const fileAdded = await ipfs.add(file);
        const ipfsHash = fileAdded.cid.toString();
        console.log("File uploaded to IPFS successfully.");
        console.log("IPFS hash:", ipfsHash);

        await userInfoContract.methods
          .addUser(caseNumber, crime, suspect, victim, witness, dateofcrime, location, officer, description, status, ipfsHash)
          .send({ from: '0xdE94D6b6118C2821f89331366B7396649a88E7b1', gas: 2000000 });
        console.log("User info added successfully.");
        console.log(
          `Submitting form with casenumber=${caseNumber}, name=${crime}, suspect=${suspect}, victim=${victim},witness=${witness},dateofcrime=${dateofcrime}, location=${location},officer=${officer}, description=${description}, status=${status}`
        );
        alert("Record added to blockchain.");
        form.reset();
      } catch (error) {
        console.error(error);
      }
    };

    // Function to handle confirmation "No" button click
    const handleConfirmationNo = () => {
      confirmationModal.style.display = "none";
    };

    confirmYesBtn.addEventListener("click", handleConfirmationYes);
    confirmNoBtn.addEventListener("click", handleConfirmationNo);
  });
}
}

// Function to handle the "View File" button click
const handleViewFile = async (event) => {
  const ipfsHash = event.target.getAttribute("data-ipfs-hash");
  console.log("Viewing file with IPFS hash:", ipfsHash);

  try {
    // Fetch the file content from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    const fileContent = new Blob(chunks);

    // Create a URL for the file content
    const fileURL = URL.createObjectURL(fileContent);

    // Open the file URL in a new window or tab
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Error retrieving file from IPFS:", error);
    // Handle the error appropriately
  }
};

const searchForm = document.getElementById("search-form");
const headers = ["CaseNo", "Crime", "Suspect", "Victim", "Witness", "Date", "Location", "Officer", "Time", "Status", "File"];
if (searchForm) {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const crime = document.getElementById("crime").value;

    try {
      const searchResults = await userInfoContract.methods.searchRecordByCrime(crime).call();
      console.log("Search Results:", searchResults);

      // Create a Set to store unique matching records
      const uniqueResults = new Set();

      // Iterate through the search results and add unique records to the Set
      searchResults.forEach((result) => {
        const recordString = JSON.stringify(result);
        uniqueResults.add(recordString);
      });

      // Convert the Set back to an array of objects
      const uniqueRecords = Array.from(uniqueResults).map((recordString) => JSON.parse(recordString));

      // Create the table element
      const table = document.createElement("table");

      // Add CSS styles to the table
      table.style.margin = "auto"; // Center align the table
      table.style.borderCollapse = "collapse"; // Collapse table borders
      table.style.width = "80%"; // Adjust the width of the table
      table.style.padding = "20px"; // Add padding to the table cells
      table.style.tableLayout = "fixed"; // Set table layout to fixed

      // Add table headers
      const headers = ["CaseNo","Crime", "Suspect", "Victim","Witness","Date", "Location", "Officer","Time","Status","File"];
      const headerRow = table.insertRow();
      headers.forEach((header) => {
        const th = document.createElement("th");
        const headerText = document.createElement("span");
        headerText.textContent = header;
        //Add ascending and descending order icons
        const ascendingIcon = document.createElement("i");
        ascendingIcon.className = "fas fa-arrow-up";
        ascendingIcon.style.cursor = "pointer";
        ascendingIcon.addEventListener("click", () => handleSort(header, "asc"));

        const descendingIcon = document.createElement("i");
        descendingIcon.className = "fas fa-arrow-down";
        descendingIcon.style.cursor = "pointer";
        descendingIcon.style.marginLeft = "5px";
        descendingIcon.addEventListener("click", () => handleSort(header, "desc"));

        // Wrap the header text and icons in a container
        const headerContainer = document.createElement("div");
        headerContainer.style.display = "flex";
        headerContainer.style.alignItems = "center";
        headerContainer.style.flexGrow = "1";
        headerContainer.appendChild(headerText);
        headerContainer.appendChild(ascendingIcon);
        headerContainer.appendChild(descendingIcon);

        th.appendChild(headerContainer);
        headerRow.appendChild(th);
      });

      // Check if any records are found
      if (uniqueRecords.length > 0) {
        // Iterate through the unique records and add rows to the table
        uniqueRecords.forEach((result) => {
          const row = table.insertRow();
          Object.values(result).forEach((value, index) => {
            const cell = row.insertCell();
            if (index === 10) {
              // For the "ipfshash" column, add a button to view the file
              const button = document.createElement("button");
              button.textContent = "View File";
              button.setAttribute("data-ipfs-hash", value);
              button.addEventListener("click", handleViewFile);
              cell.appendChild(button);
            } else {
              cell.textContent = value;
            }
          });
        });

        // Clear previous results and append the table to the search result container
        const searchResultContainer = document.getElementById("search-result");
        searchResultContainer.innerHTML = "";
        searchResultContainer.appendChild(table);
      } else {
        // No records found
        const searchResultContainer = document.getElementById("search-result");
        searchResultContainer.innerHTML = `No records found for ${crime}`;
      }
    } catch (error) {
      console.error("Error searching record:", error);
      // Handle the error appropriately
    }
  });
}

function handleSort(header, order) {
  const searchResultContainer = document.getElementById("search-result");
  const table = searchResultContainer.querySelector("table");

  // Get the index of the header clicked
  const columnIndex = headers.indexOf(header);

  // Get all the rows except the header row
  const rows = Array.from(table.rows).slice(1);

  // Sort the rows based on the column values
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex];
    const cellB = rowB.cells[columnIndex];

    const valueA = cellA.textContent.trim();
    const valueB = cellB.textContent.trim();

    if (order === "asc") {
      return compareValues(valueA, valueB);
    } else {
      return compareValues(valueB, valueA);
    }
  });

  // Clear the existing table rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add the sorted rows back to the table
  rows.forEach((row) => table.appendChild(row));

  // Update the sort order for the header
  sortOrder[header] = order;

  // Update the header styles
  updateHeaderStyles(header);
}

function compareValues(valueA, valueB) {
  // Check if the values are numeric
  const isNumeric = !isNaN(valueA) && !isNaN(valueB);

  if (isNumeric) {
    // Compare the values numerically
    return Number(valueA) - Number(valueB);
  } else if (isDate(valueA) && isDate(valueB)) {
    // Compare the values as dates
    const dateA = new Date(valueA);
    const dateB = new Date(valueB);
    return dateA - dateB;
  } else if (isTime(valueA) && isTime(valueB)) {
    // Compare the values as time
    const timeA = parseTime(valueA);
    const timeB = parseTime(valueB);
    return timeA - timeB;
  } else {
    // Compare the values as strings
    return valueA.localeCompare(valueB);
  }
}

function isDate(value) {
  // Check if the value is a valid date string
  return !isNaN(Date.parse(value));
}

function isTime(value) {
  // Check if the value is a valid time string in the format "HH:MM"
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
}

function parseTime(value) {
  // Parse the time string into minutes
  const [hours, minutes] = value.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

function updateHeaderStyles(header) {
  const headers = document.querySelectorAll(".table-header");
  headers.forEach((th) => {
    if (th.textContent === header) {
      th.classList.add("active");
    } else {
      th.classList.remove("active");
    }
  });
}



