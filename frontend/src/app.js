import { backend } from 'declarations/backend';

let currentOID = null;

async function loadOpportunities() {
    const opportunities = await backend.listOpportunities();
    const list = document.getElementById('opportunitiesListItems');
    list.innerHTML = '';
    opportunities.forEach(opp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${opp.title}</h3>
            <p>OID: ${opp.oid}</p>
            <p>${opp.description}</p>
            <div class="opportunity-actions">
                <button onclick="editOpportunity('${opp.oid}')">Edit</button>
                <button onclick="deleteOpportunity('${opp.oid}')">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function saveOpportunity() {
    const oid = document.getElementById('oidInput').value;
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;

    if (currentOID) {
        await backend.updateOpportunity(currentOID, title, description);
    } else {
        await backend.addOpportunity(oid, title, description);
    }

    clearForm();
    await loadOpportunities();
}

function clearForm() {
    document.getElementById('oidInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    currentOID = null;
    document.getElementById('oidInput').disabled = false;
}

async function editOpportunity(oid) {
    const opportunityOpt = await backend.getOpportunity(oid);
    if (opportunityOpt && 'Some' in opportunityOpt) {
        const opportunity = opportunityOpt.Some;
        document.getElementById('oidInput').value = opportunity.oid;
        document.getElementById('titleInput').value = opportunity.title;
        document.getElementById('descriptionInput').value = opportunity.description;
        currentOID = oid;
        document.getElementById('oidInput').disabled = true;
    } else {
        alert('Opportunity not found');
    }
}

async function deleteOpportunity(oid) {
    if (confirm('Are you sure you want to delete this opportunity?')) {
        await backend.deleteOpportunity(oid);
        await loadOpportunities();
    }
}

document.getElementById('saveButton').addEventListener('click', saveOpportunity);

window.editOpportunity = editOpportunity;
window.deleteOpportunity = deleteOpportunity;

loadOpportunities();
