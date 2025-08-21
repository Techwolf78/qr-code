import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminPage = () => {
  const [guestId, setGuestId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [confirmed, setConfirmed] = useState('confirmed');
  const [reached, setReached] = useState('not-arrived');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [confirmationFilter, setConfirmationFilter] = useState('all');
  const [arrivalFilter, setArrivalFilter] = useState('all');

  // Filter guests based on selected filters
  const filteredGuests = guests.filter(guest => {
    // Check confirmation filter
    const confirmationMatch = confirmationFilter === 'all' || guest.confirmed === confirmationFilter;

    // Check arrival filter
    const arrivalMatch = arrivalFilter === 'all' || guest.reached === arrivalFilter;

    return confirmationMatch && arrivalMatch;
  });

  // Handle filter changes (not needed for multi-select dropdowns)
  // const handleConfirmationFilterChange = (filter) => {
  //   setConfirmationFilters(prev => 
  //     prev.includes(filter) 
  //       ? prev.filter(f => f !== filter)
  //       : [...prev, filter]
  //   );
  // };

  // const handleArrivalFilterChange = (filter) => {
  //   setArrivalFilters(prev => 
  //     prev.includes(filter) 
  //       ? prev.filter(f => f !== filter)
  //       : [...prev, filter]
  //   );
  // };

  // Fetch guests from Firebase
  const fetchGuests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'guests'));
      const guestList = [];
      querySnapshot.forEach((doc) => {
        guestList.push({ docId: doc.id, ...doc.data() });
      });
      setGuests(guestList);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  // Add new guest
  const addGuest = async (e) => {
    e.preventDefault();
    if (!guestId || !guestName) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'guests'), {
        id: guestId,
        name: guestName,
        confirmed: confirmed,
        reached: reached
      });
      
      setGuestId('');
      setGuestName('');
      setConfirmed('confirmed');
      setReached('not-arrived');
      fetchGuests();
    } catch (error) {
      console.error('Error adding guest:', error);
    }
    setLoading(false);
  };

  // Delete guest
  const deleteGuest = async (docId) => {
    try {
      await deleteDoc(doc(db, 'guests', docId));
      fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Elements */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />
      
      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.01\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        opacity: 0.3,
        animation: "float 20s infinite linear"
      }} />

      {/* Enhanced Header */}
      <header style={{
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "24px 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "#ffffff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(0, 0, 0, 0.1)"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "800",
                margin: 0,
                letterSpacing: "-0.025em",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                Guest Management
              </h1>
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "14px",
                margin: 0,
                fontWeight: "500",
                letterSpacing: "0.025em"
              }}>
                Modern HR Dashboard
              </p>
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div style={{
            display: "flex",
            gap: "24px",
            alignItems: "center"
          }}>
            {[
              { 
                label: "Total", 
                value: guests.length, 
                icon: "👥", 
                color: "#ffffff",
                bgColor: "rgba(255, 255, 255, 0.1)"
              },
              { 
                label: "Confirmed", 
                value: guests.filter(g => g.confirmed === "confirmed").length, 
                icon: "✅", 
                color: "#ffffff",
                bgColor: "rgba(255, 255, 255, 0.1)"
              },
              { 
                label: "Arrived", 
                value: guests.filter(g => g.reached === "arrived").length, 
                icon: "🎯", 
                color: "#ffffff",
                bgColor: "rgba(255, 255, 255, 0.1)"
              }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                style={{
                  background: stat.bgColor,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  textAlign: "center",
                  minWidth: "80px",
                  animation: `slideDown 0.6s ease-out ${index * 0.1}s both`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#ffffff",
                  marginBottom: "2px",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px",
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "40px",
        alignItems: "start"
      }}>
        {/* Enhanced Guest List */}
        <div style={{
          background: "#ffffff",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.6s ease-out 0.2s both"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "#000000",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  color: "#000000",
                  fontSize: "22px",
                  fontWeight: "800",
                  margin: 0,
                  letterSpacing: "-0.025em"
                }}>
                  Guest List
                </h2>
                <p style={{
                  color: "#666666",
                  fontSize: "14px",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Manage guest entries
                </p>
              </div>
            </div>
            
            <div style={{
              background: "#f8f8f8",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "700",
              color: "#000000",
              border: "1px solid #e5e5e5"
            }}>
              {guests.length} Total
            </div>
          </div>

          {/* Filter + Actions (compact) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap"
          }}>
            {/* Confirmation filter (single select dropdown) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Confirmation:</span>
              <select
                value={confirmationFilter}
                onChange={(e) => setConfirmationFilter(e.target.value)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  background: '#fff',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '120px',
                  height: '32px'
                }}
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="not-confirmed">Pending</option>
              </select>
            </div>

            {/* Arrival filter (single select dropdown) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Arrival:</span>
              <select
                value={arrivalFilter}
                onChange={(e) => setArrivalFilter(e.target.value)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  background: '#fff',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '120px',
                  height: '32px'
                }}
              >
                <option value="all">All</option>
                <option value="arrived">Arrived</option>
                <option value="not-arrived">Not Arrived</option>
              </select>
            </div>

            {/* Clear and Export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <button
                onClick={() => { setConfirmationFilter('all'); setArrivalFilter('all'); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  background: '#f8f8f8',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >Clear</button>

              <button
                onClick={() => {
                  const pdfDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'A4' });
                  pdfDoc.setFont('helvetica', 'bold');
                  pdfDoc.setFontSize(14);
                  pdfDoc.text('Guest List', 40, 40);

                  const rows = filteredGuests.map((g, i) => [
                    i + 1,
                    g.name || '',
                    g.id || '',
                    g.confirmed === 'confirmed' ? 'Confirmed' : 'Pending',
                    g.reached === 'arrived' ? 'Arrived' : 'Pending'
                  ]);

                  autoTable(pdfDoc, {
                    startY: 60,
                    head: [["#", "Name", "ID", "Confirmation", "Arrival"]],
                    body: rows,
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [0,0,0], textColor: [255,255,255] },
                    alternateRowStyles: { fillColor: [245,245,245] },
                    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 220 }, 2: { cellWidth: 120 } }
                  });

                  const fileName = `guests_${new Date().toISOString().slice(0,10)}.pdf`;
                  pdfDoc.save(fileName);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #000',
                  background: '#000',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >Export PDF</button>

              <div style={{
                padding: '6px 10px',
                background: '#f8f8f8',
                color: '#000',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700
              }}>{filteredGuests.length} / {guests.length}</div>
            </div>
          </div>
          
          {guests.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#666666"
            }}>
              <div style={{
                width: "100px",
                height: "100px",
                background: "#f8f8f8",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                border: "8px solid #f0f0f0"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "8px",
                color: "#333333"
              }}>
                No Guests Yet
              </h3>
              <p style={{
                fontSize: "16px",
                fontWeight: "500",
                margin: 0
              }}>
                Add your first guest using the form
              </p>
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0"
            }}>
              {/* Table Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 60px",
                gap: "16px",
                padding: "16px 20px",
                background: "#f8f8f8",
                borderRadius: "12px 12px 0 0",
                border: "1px solid #e5e5e5",
                borderBottom: "none",
                fontSize: "12px",
                fontWeight: "700",
                color: "#666666",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                alignItems: "center"
              }}>
                <div></div>
                <div>Guest Information</div>
                <div style={{ textAlign: "center" }}>Confirmation</div>
                <div style={{ textAlign: "center" }}>Arrival</div>
                <div style={{ textAlign: "center" }}>Status</div>
                <div></div>
              </div>

              {/* Table Rows */}
              {filteredGuests.map((guest, index) => (
                <div
                  key={guest.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 60px",
                    gap: "16px",
                    padding: "16px 20px",
                    background: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderTop: index === 0 ? "1px solid #e5e5e5" : "none",
                    borderRadius: index === guests.length - 1 ? "0 0 12px 12px" : "0",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    alignItems: "center",
                    animation: `slideUp 0.3s ease-out ${index * 0.02}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8f8f8";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "40px",
                    height: "40px",
                    background: "#000000",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "white",
                    letterSpacing: "-0.025em"
                  }}>
                    {guest.name?.charAt(0)?.toUpperCase() || "G"}
                  </div>

                  {/* Guest Information */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#000000",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {guest.name}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666666",
                      fontFamily: "monospace"
                    }}>
                      ID: {guest.id}
                    </div>
                  </div>

                  {/* Confirmation Status */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <div style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: guest.confirmed === "confirmed" 
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(102, 102, 102, 0.05)",
                      border: `1px solid ${guest.confirmed === "confirmed" 
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(102, 102, 102, 0.1)"}`,
                      fontSize: "12px",
                      fontWeight: "600",
                      color: guest.confirmed === "confirmed" ? "#000000" : "#666666",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <span style={{ fontSize: "10px" }}>
                        {guest.confirmed === "confirmed" ? "✅" : "⏳"}
                      </span>
                      {guest.confirmed === "confirmed" ? "Confirmed" : "Pending"}
                    </div>
                  </div>

                  {/* Arrival Status */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <div style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: guest.reached === "arrived" 
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(102, 102, 102, 0.05)",
                      border: `1px solid ${guest.reached === "arrived" 
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(102, 102, 102, 0.1)"}`,
                      fontSize: "12px",
                      fontWeight: "600",
                      color: guest.reached === "arrived" ? "#000000" : "#666666",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <span style={{ fontSize: "10px" }}>
                        {guest.reached === "arrived" ? "🎯" : "⏱️"}
                      </span>
                      {guest.reached === "arrived" ? "Arrived" : "Pending"}
                    </div>
                  </div>

                  {/* Combined Status Indicator */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: guest.confirmed === "confirmed" && guest.reached === "arrived" 
                        ? "#22c55e" 
                        : guest.confirmed === "confirmed" || guest.reached === "arrived"
                        ? "#6b7280"
                        : "#d1d5db"
                    }} />
                  </div>

                  {/* Delete Button */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <button
                      onClick={() => deleteGuest(guest.docId)}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        background: "rgba(0, 0, 0, 0.02)",
                        color: "#666666",
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#000000";
                        e.target.style.color = "white";
                        e.target.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(0, 0, 0, 0.02)";
                        e.target.style.color = "#666666";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {/* Enhanced Add Guest Form */}
          <div style={{
            background: "#ffffff",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            position: "sticky",
            top: "140px",
            animation: "slideUp 0.6s ease-out 0.2s both"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "#000000",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  color: "#0f172a",
                  fontSize: "22px",
                  fontWeight: "800",
                  margin: 0,
                  letterSpacing: "-0.025em"
                }}>
                  Add New Guest
                </h2>
                <p style={{
                  color: "#64748b",
                  fontSize: "14px",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Create a new guest entry
                </p>
              </div>
            </div>

            <form onSubmit={addGuest}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  color: "#374151",
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.025em"
                }}>
                  Guest ID *
                </label>
                <input
                  type="text"
                  value={guestId}
                  onChange={(e) => setGuestId(e.target.value)}
                  placeholder="Enter unique guest ID"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "2px solid #e5e5e5",
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: "15px",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#000000";
                    e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e5e5";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#ffffff";
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  color: "#374151",
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.025em"
                }}>
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "2px solid #e5e5e5",
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: "15px",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#000000";
                    e.target.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.1)";
                    e.target.style.background = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e5e5";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#ffffff";
                  }}
                />
              </div>

              {/* Enhanced Confirmation Status */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  color: "#374151",
                  marginBottom: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.025em"
                }}>
                  Confirmation Status
                </label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  {[
                    { value: "confirmed", label: "Confirmed", icon: "✅", color: "#000000" },
                    { value: "not-confirmed", label: "Pending", icon: "⏳", color: "#666666" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: confirmed === option.value ? `2px solid ${option.color}` : "2px solid #e5e5e5",
                        background: confirmed === option.value ? `${option.color}15` : "#ffffff",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                      onMouseEnter={(e) => {
                        if (confirmed !== option.value) {
                          e.currentTarget.style.background = "#f8f8f8";
                          e.currentTarget.style.borderColor = "#cccccc";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (confirmed !== option.value) {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e5e5e5";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="confirmed"
                        value={option.value}
                        checked={confirmed === option.value}
                        onChange={(e) => setConfirmed(e.target.value)}
                        style={{
                          marginRight: "12px",
                          transform: "scale(1.2)"
                        }}
                      />
                      <span style={{ marginRight: "8px", fontSize: "16px" }}>{option.icon}</span>
                      <span style={{ color: confirmed === option.value ? option.color : "#666666" }}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Enhanced Arrival Status */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{
                  display: "block",
                  color: "#374151",
                  marginBottom: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  letterSpacing: "0.025em"
                }}>
                  Arrival Status
                </label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  {[
                    { value: "arrived", label: "Arrived", icon: "🎯", color: "#000000" },
                    { value: "not-arrived", label: "Not Arrived", icon: "⏱️", color: "#666666" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: reached === option.value ? `2px solid ${option.color}` : "2px solid #e5e5e5",
                        background: reached === option.value ? `${option.color}15` : "#ffffff",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                      onMouseEnter={(e) => {
                        if (reached !== option.value) {
                          e.currentTarget.style.background = "#f8f8f8";
                          e.currentTarget.style.borderColor = "#cccccc";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (reached !== option.value) {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e5e5e5";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="reached"
                        value={option.value}
                        checked={reached === option.value}
                        onChange={(e) => setReached(e.target.value)}
                        style={{
                          marginRight: "12px",
                          transform: "scale(1.2)"
                        }}
                      />
                      <span style={{ marginRight: "8px", fontSize: "16px" }}>{option.icon}</span>
                      <span style={{ color: reached === option.value ? option.color : "#666666" }}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading 
                    ? "#cccccc"
                    : "#000000",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "700",
                  letterSpacing: "0.025em",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: loading ? "none" : "0 10px 30px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <div style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid #ffffff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Adding Guest...
                  </div>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Add Guest
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Enhanced CSS Animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0% {
              transform: translateX(0) translateY(0);
            }
            100% {
              transform: translateX(-60px) translateY(-60px);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          @media (max-width: 1024px) {
            main {
              display: flex !important;
              flex-direction: column !important;
              gap: 20px !important;
            }
            
            .header-stats {
              flex-direction: column !important;
              gap: 12px !important;
            }

            /* On mobile, show form at bottom */
            main > div:nth-child(2) {
              order: 2 !important;
            }
            
            main > div:nth-child(1) {
              order: 1 !important;
            }
          }
          
          @media (max-width: 768px) {
            header > div {
              flex-direction: column !important;
              gap: 20px !important;
              text-align: center !important;
            }
            
            main {
              padding: 20px 16px !important;
            }
            
            .form-container, .guest-list-container {
              padding: 24px !important;
            }

            .guest-row {
              grid-template-columns: 40px 1fr 40px !important;
              gap: 12px !important;
            }

            .guest-row .status-columns {
              display: none !important;
            }

            .guest-info-mobile {
              display: block !important;
            }
          }
          
          @media (max-width: 640px) {
            .confirmation-grid, .arrival-grid {
              grid-template-columns: 1fr !important;
            }
            
            .guest-status-grid {
              grid-template-columns: 1fr !important;
            }

            .table-header {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminPage;
