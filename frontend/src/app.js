import { backend } from 'declarations/backend';

let currentOID = null;

async function loadOpportunities() {
    const opportunities = await backend.listOpportunities();
    const list = document.getElementById('opportunitiesListItems');
    list.innerHTML = '';
    opportunities.forEach(opp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> ${opp.title}</h3>
            <p><strong>OID:</strong> ${opp.oid}</p>
            <p>${opp.description}</p>
            <div class="opportunity-actions">
                <button onclick="editOpportunity('${opp.oid}')"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteOpportunity('${opp.oid}')"><i class="fas fa-trash-alt"></i> Delete</button>
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
    try {
        const opportunityOpt = await backend.getOpportunity(oid);
        if (opportunityOpt) {
            const opportunity = opportunityOpt;
            document.getElementById('oidInput').value = opportunity.oid;
            document.getElementById('titleInput').value = opportunity.title;
            document.getElementById('descriptionInput').value = opportunity.description;
            currentOID = oid;
            document.getElementById('oidInput').disabled = true;
        } else {
            throw new Error('Opportunity not found');
        }
    } catch (error) {
        console.error('Error editing opportunity:', error);
        alert('Error editing opportunity: ' + error.message);
    }
}

async function deleteOpportunity(oid) {
    if (confirm('Are you sure you want to delete this opportunity?')) {
        try {
            const result = await backend.deleteOpportunity(oid);
            if (result) {
                await loadOpportunities();
            } else {
                throw new Error('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            alert('Error deleting opportunity: ' + error.message);
        }
    }
}

document.getElementById('saveButton').addEventListener('click', saveOpportunity);

window.editOpportunity = editOpportunity;
window.deleteOpportunity = deleteOpportunity;

loadOpportunities();
